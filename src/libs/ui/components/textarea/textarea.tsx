import React, { forwardRef } from 'react';
import styled from 'styled-components';

import { BaseProps } from '@libs/ui';

type Ref = HTMLTextAreaElement;

const StyledTextArea = styled.textarea<{
  resize?: boolean;
  isDisabled?: boolean;
  readOnly?: boolean;
}>(({ theme, resize, isDisabled, readOnly }) => ({
  fontSize: '1.5rem',
  border: 'none',
  borderRadius: theme.borderRadius.base + 'px',
  resize: resize ? 'horizontal' : 'none',
  height: '100%',
  width: '100%',
  padding: '12px 16px',

  backgroundColor: theme.color.backgroundPrimary,
  color: theme.color.contentPrimary,

  ...((isDisabled || readOnly) && {
    color: theme.color.contentSecondary
  })
}));

interface TextAreaProps extends BaseProps {
  value?: string;
  name?: string;
  cols?: number;
  rows?: number;
  resize?: boolean;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
}

export const TextArea = forwardRef<Ref, TextAreaProps>(function TextArea(
  { children, disabled, ...restProps },
  ref
) {
  return (
    <StyledTextArea ref={ref} isDisabled={disabled} {...restProps}>
      {children}
    </StyledTextArea>
  );
});
