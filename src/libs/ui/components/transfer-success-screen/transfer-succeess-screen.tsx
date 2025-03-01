import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  ContentContainer,
  ParagraphContainer,
  SpacingSize,
  VerticalSpaceContainer
} from '@src/libs/layout';
import { SvgIcon, Typography } from '@libs/ui';

interface TransferSuccessScreenProps {
  isNftTransfer?: boolean;
}

export const TransferSuccessScreen = ({
  isNftTransfer = false
}: TransferSuccessScreenProps) => {
  const { t } = useTranslation();

  return (
    <ContentContainer>
      <ParagraphContainer top={SpacingSize.XL}>
        <SvgIcon
          src="assets/illustrations/success.svg"
          width={200}
          height={120}
        />
        <VerticalSpaceContainer top={SpacingSize.XL}>
          <Typography type="header">
            <Trans t={t}>
              {isNftTransfer
                ? 'You’ve sent the NFT'
                : 'You submitted a transaction'}
            </Trans>
          </Typography>
        </VerticalSpaceContainer>
        <VerticalSpaceContainer top={SpacingSize.Medium}>
          <Typography type="body" color="contentSecondary">
            <Trans t={t}>
              You can check its status in the Deploys tab on your Wallet home
              page.
            </Trans>
          </Typography>
        </VerticalSpaceContainer>
      </ParagraphContainer>
    </ContentContainer>
  );
};
