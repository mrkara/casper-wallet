import 'mac-scrollbar/dist/mac-scrollbar.css';

import { GlobalScrollbar } from 'mac-scrollbar';
import React, { Suspense, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { isActionOf } from 'typesafe-actions';
import browser from 'webextension-polyfill';

import { GlobalStyle, themeConfig } from '@libs/ui';
import { ErrorBoundary } from '@popup/error-boundary';

import { App } from './app';
import { createMainStoreReplica } from './redux/utils';
import {
  BackgroundEvent,
  backgroundEvent,
  PopupState
} from '@src/background/background-events';
import { popupWindowInit } from './redux/windowManagement/actions';

const Tree = () => {
  const [state, setState] = useState<PopupState | null>(null);

  // setup listener to state events
  useEffect(() => {
    function handleBackgroundMessage(message: BackgroundEvent) {
      if (isActionOf(backgroundEvent.popupStateUpdated)(message)) {
        setState(message.payload);
      }
    }
    browser.runtime.onMessage.addListener(handleBackgroundMessage);
    browser.runtime.sendMessage(popupWindowInit());

    return () => {
      browser.runtime.onMessage.removeListener(handleBackgroundMessage);
    };
  }, []);

  if (state == null) {
    return null;
  }

  const store = createMainStoreReplica(state);

  return (
    <Suspense fallback={null}>
      <ErrorBoundary>
        <ThemeProvider theme={themeConfig}>
          <GlobalStyle />
          <GlobalScrollbar />
          <ReduxProvider store={store}>
            <HashRouter>
              <App />
            </HashRouter>
          </ReduxProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </Suspense>
  );
};

render(<Tree />, window.document.querySelector('#app-container'));
