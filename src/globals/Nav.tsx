import { useState, useContext } from "react";
import { View, Image, SafeAreaView, Platform } from "react-native";
import { Appbar, Text, Menu, Button } from 'react-native-paper';
import { getHeaderTitle } from '@react-navigation/elements';
import styles from 'globals/Styles';
import AsyncStorageHelpers from 'globals/async-storage-helpers';
import { useAuth } from 'contexts/auth-context';
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';

const Nav = (props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [menuAnchor, setMenuAnchor] = useState({ x: 0, y: 0 })
    const {
        authToken, setAuthToken,
        isLoggedIn, setIsLoggedIn,
        showLoader, setShowLoader,
        snackbarMsg, setSnackbarMsg
    } = useAuth();
    const navigation = useNavigation();
    let routeName = props.routeName;

    const [fontsLoaded, fontError] = useFonts({
        'Salsa-Regular': require('../../assets/fonts/Salsa-Regular.ttf'),
        'jempolfreak': require('../../assets/fonts/jempolfreak.ttf'),
        'Aquifer': require('../../assets/fonts/Aquifer.ttf'),
        'HandTIMES': require('../../assets/fonts/HandTIMES.ttf'),
    });

    const titleFont = 'HandTIMES';

    const title = routeName;

    const openMenu = (event) => {
        const { nativeEvent } = event;
        const anchor = {
            x: nativeEvent.pageX,
            y: nativeEvent.pageY,
        };

        setMenuAnchor(anchor);
        setMenuVisible(true);
    }

    const closeMenu = () => setMenuVisible(false);

    const aboutPressed = () => {
        closeMenu();
        navigation.navigate('About');
    }

    const logoutPressed = async () => {
        closeMenu();
        setShowLoader(true);
        try {
            const result = await AsyncStorageHelpers.removeAuth();
            if (!result) {
                console.error("Failed to remove auth token");
            } else {
                setAuthToken(null);
                setIsLoggedIn(false);
                setShowLoader(false);
                navigation.navigate('Volunteer Login');
            }
        } catch (error) {
            console.error(error);
            setAuthToken(null);
            setIsLoggedIn(false);
            setShowLoader(false);
        }
    }

    return (
        <View
        style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            backgroundColor: 'white',
        }}
        >
        <View style={styles.appBar}>
        <View
        style={{marginRight: 'auto'}}
        >
        <Image
        resizeMethod="scale"
        resizeMode="contain"
        style={styles.logo}
        source={require('./assets/trc-logo-transparent-icon.png')}
        onPress={() => {
            navigation.navigate('Repairs');
        }}
        />
        </View>
        <View style={{alignText: 'center', justifyContent: 'center'}}>
        <Text style={[styles.appBarTitle, {fontFamily: titleFont}]}>
        {title}
        </Text>
        </View>
        <View
        style={{marginLeft: 'auto'}}
        >
        <Button
        width={60}
        icon={Platform.OS === 'ios' ? 'dots-horizontal' : 'dots-vertical'}
        onPress={openMenu}
        style={{width: 60}}
        />
        </View>
        <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        anchor={menuAnchor}
        >
        <Menu.Item
        title="About"
        onPress={aboutPressed}
        />
        {isLoggedIn &&
            <Menu.Item
            title="Log out"
            onPress={logoutPressed}
            />
        }
        </Menu>
        </View>
        </View>
    );
}

export default Nav;
