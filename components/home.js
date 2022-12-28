import { View, SafeAreaView, Platform, ScrollView, StatusBar } from 'react-native';
import {
  Button,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation
} from 'react-native-paper';
// Custom Components
import ResponsiveButton from "../globals/ResponsiveButton"
import Nav from "../globals/Nav"
// Styles
import styles from '../globals/Styles.js'

const Home = () => {

	return (
    <View style={styles.container}>
      <StatusBar style = "auto" />
      <Nav></Nav>
  		<ScrollView>
        <View style = {styles.content}>
          <ResponsiveButton  button_text = {"I have broken items"} ></ResponsiveButton>
          <ResponsiveButton button_text = {"I am a repairer"}></ResponsiveButton>
          <ResponsiveButton button_text = {"Who's in the queue?"}> </ResponsiveButton>
        </View>

        <View style = {{flex: 1, alignItems: "flex-start55  ", justifyContent: "flex-end"}}>
          <Button mode="text" style = {{width:"100%", alignItems: "flex-start", marginTop: 30}}>
            Admin Login
            </Button>
        </View>
      </ScrollView>
    </View>
	);

};

export default Home;