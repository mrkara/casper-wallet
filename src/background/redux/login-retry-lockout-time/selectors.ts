import { RootState } from 'typesafe-actions';
import { createSelector } from 'reselect';

import { LoginRetryLockoutTimeState } from './types';

export const selectLoginRetryLockoutTime = (
  state: RootState
): LoginRetryLockoutTimeState => state.loginRetryLockoutTime;

export const selectHasLoginRetryLockoutTime = createSelector(
  selectLoginRetryLockoutTime,
  loginRetryLockoutTime => loginRetryLockoutTime != null
);
