import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Typography } from '@libs/ui';
import { TabPageContainer, TabTextContainer } from '@src/libs/layout';

export function CreateSecretPhraseContent() {
  const { t } = useTranslation();

  return (
    <TabPageContainer>
      <Typography type="header">
        <Trans t={t}>Create secret recovery phrase</Trans>
      </Typography>
      <TabTextContainer>
        <Typography type="body" color="contentSecondary">
          <Trans t={t}>
            Your unique secret recovery phrase allows you to recover your wallet
            at any time on any device that has Casper Wallet installed.
          </Trans>
        </Typography>
      </TabTextContainer>
    </TabPageContainer>
  );
}
