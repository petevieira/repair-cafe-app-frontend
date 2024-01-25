import React from "react";
import { View, Text, Image} from "react-native";
import { Appbar } from 'react-native-paper';
import styles from './Styles';
import img_data from '../images/rc_images.json';
import { useNavigation } from '@react-navigation/native';

const Nav = () => {
  const navigation = useNavigation();

  const goToAboutPage = () => {
    navigation.navigate("About")
  }

  return (
    <Appbar.Header style = {{backgroundColor: 'white'}}>
        <Image source={require("../assets/trc-logo-transparent.png")} style={styles.logo} />
        <Appbar.Content
          title="About"
          style={{alignItems: "flex-end"}}
          onPress={goToAboutPage}
        />
    </Appbar.Header>
  );
};

export default Nav;

/*
<Image source={{ uri: img_data["logo_sm"].img_url }} style={styles.logo} />
*/