import { createAction } from 'typesafe-actions';
import { Account, VaultState } from '@src/background/redux/vault/types';
import { SecretPhrase } from '@src/libs/crypto';

export const vaultReseted = createAction('VAULT_RESETED')<void>();

export const vaultLoaded = createAction('VAULT_LOADED')<VaultState>();

export const secretPhraseCreated = createAction(
  'SECRET_PHRASE_CREATED'
)<SecretPhrase>();

export const accountImported = createAction('ACCOUNT_IMPORTED')<Account>();
export const accountAdded = createAction('ACCOUNT_ADDED')<Account>();
export const accountRemoved = createAction('ACCOUNT_REMOVED')<{
  accountName: string;
}>();
export const accountRenamed = createAction('ACCOUNT_RENAMED')<{
  oldName: string;
  newName: string;
}>();

export const siteConnected = createAction('SITE_CONNECTED')<{
  siteOrigin: string;
  accountNames: string[];
  siteTitle: string;
}>();

export const anotherAccountConnected = createAction(
  'ANOTHER_ACCOUNT_CONNECTED'
)<{
  siteOrigin: string;
  accountName: string;
}>();

export const accountDisconnected = createAction('ACCOUNT_DISCONNECTED')<{
  accountName: string;
  siteOrigin: string;
}>();

export const siteDisconnected = createAction('SITE_DISCONNECTED')<{
  siteOrigin: string;
}>();

export const activeAccountChanged = createAction(
  'ACTIVE_ACCOUNT_CHANGED'
)<string>();

export const deploysReseted = createAction('DEPLOYS_RESETED')<void>();

export const deployPayloadReceived = createAction('DEPLOY_PAYLOAD_RECEIVED')<{
  id: string;
  json: string;
}>();
