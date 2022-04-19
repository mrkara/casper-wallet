import React, { forwardRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import styled, { CSSObject } from 'styled-components';

import { matchSize, BaseProps, Size } from '@src/libs/ui';

type Ref = HTMLSpanElement;

export type TypographyType = 'header' | 'body' | 'caption' | 'label' | 'hash';
export type TypographyWeight = 'regular' | 'medium' | 'semiBold';

export type TextVariation =
  | 'inherit'
  | 'contentBlue'
  | 'contentPrimary'
  | 'contentSecondary'
  | 'contentOnFill';

type Transform = 'uppercase' | 'capitalize' | 'unset';

export interface TypographyProps extends BaseProps {
  type: TypographyType;
  weight: TypographyWeight;
  variation?: TextVariation;
  monotype?: boolean;
  uppercase?: boolean;
  capitalize?: boolean;
  noWrap?: boolean;
  loading?: boolean;
  size?: Size;
  transform?: Transform;
}

const StyledTypography = styled('span').withConfig({
  shouldForwardProp: (prop, defaultValidatorFn) =>
    !['loading'].includes(prop) && defaultValidatorFn(prop)
})<TypographyProps>(
  ({
    theme,
    type,
    weight,
    size = 2,
    loading,
    variation = 'inherit',
    monotype = false,
    uppercase = false,
    capitalize = false,
    noWrap = false,
    transform = 'unset'
  }): CSSObject => {
    const body: CSSObject = {
      fontFamily: monotype
        ? theme.typography.fontFamily.mono
        : theme.typography.fontFamily.primary,
      fontWeight: monotype
        ? theme.typography.fontWeight.regular
        : theme.typography.fontWeight[weight],
      color: {
        inherit: 'inherit',
        contentSecondary: theme.color.contentSecondary,
        contentPrimary: theme.color.contentPrimary,
        contentOnFill: theme.color.contentOnFill,
        contentBlue: theme.color.contentBlue
      }[variation],
      whiteSpace: noWrap ? 'nowrap' : 'initial',
      ...(loading && {
        display: 'inline-block',
        width: '100%'
      }),
      ...(uppercase && {
        textTransform: 'uppercase'
      }),
      ...(capitalize && {
        textTransform: 'capitalize'
      }),
      '-webkit-text-size-adjust': '100%'
    };

    switch (type) {
      case 'header':
        return {
          ...body,
          fontWeight: theme.typography.header.fontWeight.bold,
          fontSize: matchSize(
            {
              0: '2rem',
              1: '1.8rem',
              2: '1.6rem',
              3: '1.5rem',
              4: '1.4rem',
              5: '1.2rem'
            },
            size
          ),
          lineHeight: matchSize(
            {
              0: '4.8rem',
              1: '4rem',
              2: '1.8rem',
              3: '2.8rem',
              4: '2rem',
              5: '2.4rem'
            },
            size
          )
        };
      case 'caption':
        return {
          ...body,
          fontSize: '1.4rem',
          lineHeight: '2rem'
        };
      case 'label':
        return {
          ...body,
          textTransform: transform
        };
      case 'hash':
        return {
          ...body,
          fontFamily: theme.typography.fontFamily.mono
        };
      case 'body':
        return body;
      default:
        throw new Error('Unknown type of Typography');
    }
  }
);

export const Typography = forwardRef<Ref, TypographyProps>(function Typography(
  { ...props },
  ref
) {
  if (props.loading) {
    return (
      <StyledTypography ref={ref} {...props}>
        <Skeleton />
      </StyledTypography>
    );
  }

  return <StyledTypography ref={ref} {...props} />;
});
