import { createReducer } from 'typesafe-actions';

import { TimeoutDurationSetting } from '@popup/constants';
import {
  changeTimeoutDuration,
  refreshTimeout,
  createVault,
  lockVault,
  unlockVault,
  resetVault,
  importAccount,
  removeAccount,
  renameAccount,
  switchActiveAccount
} from './actions';
import { VaultState } from './types';

type State = VaultState;

const initialState: State = {
  password: null,
  isLocked: false,
  timeoutDurationSetting: TimeoutDurationSetting['5 min'],
  lastActivityTime: null,
  accounts: [],
  activeAccount: null
};

export const reducer = createReducer(initialState)
  .handleAction(
    [createVault],
    (state, { payload: { password, lastActivityTime } }): State => ({
      ...state,
      password,
      lastActivityTime
    })
  )
  .handleAction([resetVault], () => initialState)
  .handleAction(
    lockVault,
    (state, { payload }): State => ({
      ...state,
      isLocked: true,
      lastActivityTime: null
    })
  )
  .handleAction(
    unlockVault,
    (state, { payload: { lastActivityTime } }): State => ({
      ...state,
      lastActivityTime,
      isLocked: false
    })
  )
  .handleAction([importAccount], (state, { payload }): State => {
    return {
      ...state,
      accounts: [...state.accounts, payload],
      activeAccount: state.accounts.length === 0 ? payload : state.activeAccount
    };
  })
  .handleAction(switchActiveAccount, (state, { payload }) => ({
    ...state,
    activeAccount:
      state.accounts.find(account => account.name === payload) || null
  }))
  .handleAction(
    [removeAccount],
    (state, { payload: { name } }): State => ({
      ...state,
      accounts: state.accounts.filter(account => account.name !== name)
    })
  )
  .handleAction(
    [renameAccount],
    (state, { payload: { oldName, newName } }): State => ({
      ...state,
      accounts: state.accounts.map(account => {
        if (account.name === oldName) {
          return {
            ...account,
            name: newName
          };
        }
        return account;
      })
    })
  )
  .handleAction(
    [changeTimeoutDuration],
    (state, { payload: { timeoutDuration, lastActivityTime } }): State => ({
      ...state,
      timeoutDurationSetting: timeoutDuration,
      lastActivityTime
    })
  )
  .handleAction(
    [refreshTimeout],
    (state, { payload: { lastActivityTime } }) => ({
      ...state,
      lastActivityTime
    })
  );
