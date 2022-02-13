import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

import { makeRandomId } from './Util';

class Storage {
  /** An anonymous, install-unique id. For future analytics. */
  static KEY_INSTALLATION_ID = 'installation_id';

  /** ID of the default organization in the nav switcher. */
  static KEY_DEFAULT_ORG_ID = 'default_org_id';

  /** Stores the auth tokens from our api. */
  static SECURE_KEY_API_AUTH_TOKEN = 'api_auth_token';

  constructor(environmentName) {
    this.environmentName = environmentName;
  }

  async _get(keyName, defaultValue = null) {
    const item = await AsyncStorage.getItem(`${this.environmentName}.${keyName}`);
    if (item !== null) {
      try {
        return JSON.parse(item);
      } catch (e) {}
    }
    return defaultValue;
  }

  async _set(keyName, value) {
    await AsyncStorage.setItem(`${this.environmentName}.${keyName}`, JSON.stringify(value));
  }

  async _getSecure(keyName, defaultValue = null) {
    const result = await SecureStore.getItemAsync(`${this.environmentName}.${keyName}`);
    if (!result) {
      return defaultValue;
    }
    return JSON.parse(result);
  }

  async _setSecure(keyName, value) {
    await SecureStore.setItemAsync(`${this.environmentName}.${keyName}`, JSON.stringify(value));
  }

  async getInstallationId() {
    let installationId = await this._get(Storage.KEY_INSTALLATION_ID);
    if (!installationId) {
      installationId = makeRandomId('inst');
      await this._set(Storage.KEY_INSTALLATION_ID, installationId);
    }
    return installationId;
  }

  async getDefaultOrgId(defaultValue = null) {
    return await this._get(Storage.KEY_DEFAULT_ORG_ID, defaultValue);
  }

  async setDefaultOrgId(orgId) {
    return await this._set(Storage.KEY_DEFAULT_ORG_ID, orgId);
  }

  async setAuthToken(token) {
    await this._setSecure(Storage.SECURE_KEY_API_AUTH_TOKEN, token);
  }

  async getAuthToken(defaultValue = null) {
    const result = await this._getSecure(Storage.SECURE_KEY_API_AUTH_TOKEN, defaultValue);
    return result;
  }

  async reset() {
    await AsyncStorage.clear();
    await this.setAuthToken('');
  }
}

export default Storage;
