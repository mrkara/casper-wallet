import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import {
  ContentContainer,
  ParagraphContainer,
  SpacingSize
} from '@libs/layout';
import { Typography } from '@libs/ui';

interface ChangePasswordPageContentProps {
  children: React.ReactNode;
}

export const ChangePasswordPageContent = ({
  children
}: ChangePasswordPageContentProps) => {
  const { t } = useTranslation();

  return (
    <ContentContainer>
      <ParagraphContainer top={SpacingSize.XL}>
        <Typography type="header">
          <Trans t={t}>Change Password</Trans>
        </Typography>
      </ParagraphContainer>

      {children}
    </ContentContainer>
  );
};
