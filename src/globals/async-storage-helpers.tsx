import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageConsts } from 'consts/app.consts';

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
        const storedData = await AsyncStorage.getItem(StorageConsts.AUTH);

        if (!storedData) {
            return null;
        }

        const data = JSON.parse(storedData);

        if (!data || typeof data !== 'object' || !data.user || !data.token) {
            return null
        }

        return data;
    } catch (error) {
        console.error(error);
        return null;
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