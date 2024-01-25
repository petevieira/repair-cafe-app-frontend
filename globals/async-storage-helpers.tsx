import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageConsts } from '../consts/app.consts';

const storeAuth = async (data) => {
  try {
    await AsyncStorage.setItem(
      StorageConsts.AUTH,
      JSON.stringify(data)
    );
    return true;
  } catch (error) {
    console.error(`Error saving ${StorageConsts.AUTH} in AsyncStorage: `, error);
    return Promise.reject(error);
  }
}

const getAuth = async () => {
  try {
    const data = JSON.parse(
      await AsyncStorage.getItem(StorageConsts.AUTH)
    );
    if (!data || data === '' || !data.user || !data.token) {
      return console.debug(`No ${StorageConsts.AUTH} in AsyncStorage`);
      return null
    }
    return data;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

const removeAuth = async () => {
  try {
    await AsyncStorage.removeItem(StorageConsts.AUTH);
    return true;
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}

export default { storeAuth, getAuth, removeAuth };