import './i18n';

import React, { useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
// import browser from 'webextension-polyfill';

import { Layout, Header } from '@src/layout';

import { CreateVaultPageContent } from '@src/pages/create-vault';
import { NoAccountsPageContent } from '@src/pages/no-accounts';
import { UnlockVaultPageContent } from '@src/pages/unlock-vault';
import { TimeoutPageContent } from '@src/pages/timeout';
import { HomePageContent } from '@src/pages/home';
import { NavigationMenuPageContent } from '@src/pages/navigation-menu';

import { RouterPaths as RoutePath } from './router/paths';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectVaultHasAccount,
  selectVaultDoesExist,
  selectVaultIsLocked,
  selectVaultTimeoutDurationSetting,
  selectVaultTimeoutStartTime
} from '@src/redux/vault/selectors';
import { lockVault, resetTimeoutStartTime } from '@src/redux/vault/actions';
import { MapTimeoutDurationSettingToValue } from './constants';
import { useTypedLocation } from './router';

export function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useTypedLocation();
  const state = location.state;

  const vaultIsLocked = useSelector(selectVaultIsLocked);
  const vaultDoesExists = useSelector(selectVaultDoesExist);
  const vaultHasAccount = useSelector(selectVaultHasAccount);
  const vaultTimeoutDurationSetting = useSelector(
    selectVaultTimeoutDurationSetting
  );
  const vaultTimeoutStartTime = useSelector(selectVaultTimeoutStartTime);

  // App redirects
  useEffect(() => {
    if (vaultIsLocked) {
      navigate(RoutePath.UnlockVault);
    } else if (!vaultDoesExists) {
      navigate(RoutePath.CreateVault);
    } else if (!vaultHasAccount) {
      navigate(RoutePath.NoAccounts);
    }
    // `location.pathname` is needed as a dependency to enable vault and account checking for each route.
    // For the first time it was necessary to make a secure click on the logo
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, vaultDoesExists, vaultHasAccount, vaultIsLocked]);

  // Timer of locking app
  useEffect(() => {
    const events = [
      'load',
      'mousemove',
      'mousedown',
      'click',
      'scroll',
      'keypress'
    ];

    function resetTimeout() {
      dispatch(resetTimeoutStartTime());
    }

    const handleResetTimeout = debounce(resetTimeout, 5000);

    // Reset times on user interaction
    for (let i in events) {
      window.addEventListener(events[i], handleResetTimeout);
    }

    let interval: NodeJS.Timeout;
    let currentTime = Date.now();

    if (vaultDoesExists && !vaultIsLocked && vaultTimeoutStartTime) {
      const timeoutDurationValue =
        MapTimeoutDurationSettingToValue[vaultTimeoutDurationSetting];
      // Check up on opening popup
      if (currentTime - vaultTimeoutStartTime >= timeoutDurationValue) {
        dispatch(lockVault());
      } else {
        // Check up for opened popup
        interval = setInterval(() => {
          currentTime = Date.now();
          if (currentTime - vaultTimeoutStartTime >= timeoutDurationValue) {
            dispatch(lockVault());
          }
        }, 1000);
      }
    }
    return () => {
      clearInterval(interval);
      for (let i in events) {
        window.removeEventListener(events[i], handleResetTimeout);
      }
    };
  }, [
    dispatch,
    vaultDoesExists,
    vaultIsLocked,
    vaultTimeoutStartTime,
    vaultTimeoutDurationSetting
  ]);

  return (
    <Routes>
      {state?.showNavigationMenu ? (
        <Route>
          <Route
            path="*"
            element={
              <Layout
                Header={<Header withMenu withLock />}
                Content={<NavigationMenuPageContent />}
              />
            }
          />
        </Route>
      ) : (
        <Route>
          <Route
            path={RoutePath.Home}
            element={
              <Layout
                Header={<Header withMenu withLock />}
                Content={<HomePageContent />}
              />
            }
          />
          <Route
            path={RoutePath.CreateVault}
            element={
              <Layout
                Header={<Header />}
                Content={<CreateVaultPageContent />}
              />
            }
          />
          <Route
            path={RoutePath.NoAccounts}
            element={
              <Layout
                Header={<Header withLock />}
                Content={<NoAccountsPageContent />}
              />
            }
          />
          <Route
            path={RoutePath.UnlockVault}
            element={
              <Layout
                Header={<Header />}
                Content={<UnlockVaultPageContent />}
              />
            }
          />
          <Route
            path={RoutePath.Timeout}
            element={
              <Layout
                Header={<Header submenuActionType="close" withMenu withLock />}
                Content={<TimeoutPageContent />}
              />
            }
          />
        </Route>
      )}
    </Routes>
  );
}
