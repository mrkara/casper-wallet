import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { UseFormRegister } from 'react-hook-form';

import {
  TabPageContainer,
  TabTextContainer,
  InputsContainer
} from '@libs/layout';
import { FormField, FormFieldStatus, TextArea, Typography } from '@libs/ui';
import { RecoverSecretPhraseFormValues } from '@src/libs/ui/forms/recover-from-secret-phrase';

interface RecoverFromSecretPhrasePageContentProps {
  register: UseFormRegister<RecoverSecretPhraseFormValues>;
  errorMessage?: string;
}

export function RecoverFromSecretPhrasePageContent({
  register,
  errorMessage
}: RecoverFromSecretPhrasePageContentProps) {
  const { t } = useTranslation();
  return (
    <TabPageContainer>
      <Typography type="header">
        <Trans t={t}>Please enter your secret recovery phrase</Trans>
      </Typography>

      <TabTextContainer>
        <Typography type="body" color="contentSecondary">
          <Trans t={t}>
            Recover your wallet by entering each word of your 24-word secret
            recovery phrase, separated by spaces.
          </Trans>
        </Typography>
      </TabTextContainer>
      <InputsContainer>
        <FormField
          status={errorMessage ? FormFieldStatus.Error : undefined}
          statusText={errorMessage}
        >
          <TextArea
            rows={6}
            {...register('phrase')}
            placeholder={t('e.g. Bobcat Lemon Blanket…')}
          />
        </FormField>
      </InputsContainer>
    </TabPageContainer>
  );
}
