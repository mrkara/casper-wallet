import { DeployUtil } from 'casper-js-sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  FooterButtonsContainer,
  LayoutWindow,
  PopupHeader
} from '@libs/layout';
import { closeCurrentWindow } from '@src/background/close-current-window';
import {
  selectConnectedAccountNamesWithActiveOrigin,
  selectDeploysJsonById,
  selectVaultAccounts
} from '@src/background/redux/vault/selectors';
import { sdkMethod } from '@src/content/sdk-method';
import { Button } from '@src/libs/ui';

import { SignDeployContent } from './sign-deploy-content';
import { signDeploy } from '@src/libs/crypto';
import { CasperDeploy } from './deploy-types';
import { convertBytesToHex } from '@src/libs/crypto/utils';
import { sendSdkResponseToSpecificTab } from '@src/background/send-sdk-response-to-specific-tab';

export function SignDeployPage() {
  const { t } = useTranslation();

  const [deploy, setDeploy] = useState<undefined | CasperDeploy>(undefined);

  const searchParams = new URLSearchParams(document.location.search);
  const requestId = searchParams.get('requestId');
  const signingPublicKeyHex = searchParams.get('signingPublicKeyHex');

  if (!requestId || !signingPublicKeyHex) {
    throw Error('Missing search param');
  }

  const renderDeps = [requestId, signingPublicKeyHex];

  const vaultAccounts = useSelector(selectVaultAccounts);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const accounts = useMemo(() => vaultAccounts, renderDeps);

  const connectedAccountNamesWithOrigin = useSelector(
    selectConnectedAccountNamesWithActiveOrigin
  );
  const connectedAccountNames = useMemo(
    () => connectedAccountNamesWithOrigin,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    renderDeps
  );

  const deployJsonById = useSelector(selectDeploysJsonById);
  useEffect(() => {
    const deployJson = deployJsonById[requestId];
    if (deployJson == null) {
      return;
    }

    const res = DeployUtil.deployFromJson(deployJson);
    if (!res.ok) {
      const error = Error('Parsing deploy from json error');
      sendSdkResponseToSpecificTab(sdkMethod.signError(error, { requestId }));
      throw error;
    }

    setDeploy(res.val);

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, renderDeps);

  const signingAccount = accounts.find(
    a => a.publicKey === signingPublicKeyHex
  );
  // signing account should exist in wallet
  if (signingAccount == null) {
    const error = Error('No signing account');
    sendSdkResponseToSpecificTab(sdkMethod.signError(error, { requestId }));
    throw error;
  }

  // signing account should be connected to site
  if (
    connectedAccountNames != null &&
    !connectedAccountNames.includes(signingAccount.name)
  ) {
    const error = Error(
      'Account with signingPublicKeyHex is not connected to site'
    );
    sendSdkResponseToSpecificTab(sdkMethod.signError(error, { requestId }));
    throw error;
  }

  const handleSign = useCallback(() => {
    if (deploy?.hash == null) {
      return;
    }

    const signature = signDeploy(
      deploy.hash,
      signingAccount.publicKey,
      signingAccount.secretKey
    );
    sendSdkResponseToSpecificTab(
      sdkMethod.signResponse(
        { signatureHex: convertBytesToHex(signature), cancelled: false },
        { requestId }
      )
    );
    closeCurrentWindow();
  }, [
    signingAccount?.publicKey,
    signingAccount?.secretKey,
    deploy?.hash,
    requestId
  ]);

  const handleCancel = useCallback(() => {
    sendSdkResponseToSpecificTab(
      sdkMethod.signResponse({ cancelled: true }, { requestId })
    );
    closeCurrentWindow();
  }, [requestId]);

  useEffect(() => {
    window.addEventListener('beforeunload', handleCancel);

    return () => window.removeEventListener('beforeunload', handleCancel);
  }, [handleCancel]);

  return (
    <LayoutWindow
      renderHeader={() => <PopupHeader withConnectionStatus />}
      renderContent={() => (
        <SignDeployContent
          deploy={deploy}
          signingPublicKeyHex={signingAccount.publicKey}
        />
      )}
      renderFooter={() => (
        <FooterButtonsContainer>
          <Button
            color="primaryRed"
            disabled={deploy == null}
            onClick={handleSign}
          >
            <Trans t={t}>Sign</Trans>
          </Button>
          <Button color="secondaryBlue" onClick={handleCancel}>
            <Trans t={t}>Cancel</Trans>
          </Button>
        </FooterButtonsContainer>
      )}
    />
  );
}
