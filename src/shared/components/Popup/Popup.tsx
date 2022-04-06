import React from 'react';

import logo from '@src/assets/img/logo192.png';

import { CreateVault } from '@src/pages/CreateVault';

import { AppContainer, AppLogo, AppLink, AppHeader } from './Popup.styled';

export function Popup(): JSX.Element {
  return (
    <AppContainer>
      {/* TODO: Temporary code. Need to implement routing. After that this code should be updated */}
      {true ? (
        <CreateVault />
      ) : (
        <AppHeader>
          <AppLogo src={logo} alt="logo" />
          <p>
            Edit <code>src/shared/Popup/components/Popup.jsx</code> and save to
            reload.
          </p>
          <AppLink
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React!
          </AppLink>
        </AppHeader>
      )}
    </AppContainer>
  );
}
