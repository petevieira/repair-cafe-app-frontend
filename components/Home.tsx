import { View, SafeAreaView, Platform, ScrollView, StatusBar } from 'react-native';
import { Button, Paragraph, Dialog, Portal, Provider, TextInput, Text, BottomNavigation } from 'react-native-paper';
// Custom Components
import SubmitButton from "../globals/SubmitButton";
import Nav from "../globals/Nav";
// Styles
import styles from '../globals/Styles';
import Item from '../models/Item';
import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  const redirectOwner = () => {
    navigation.navigate('AddEditRepair', {
      item: new Item()
    })
  };

  const redirectVolunteer = () => {
    navigation.navigate('EmailEntry');
  };

	return (
    <View style={styles.container}>
      <SubmitButton
        text={"I have broken items"}
        onPress={() => {redirectOwner()}}
      />
      <SubmitButton
        text={"I am a volunteer"}
        onPress={() => {redirectVolunteer()}}
      />
    </View>
	);

};

export default Home;