import {StyleSheet} from "react-native";

export default StyleSheet.create({
  logo: {
    height: 140,
    aspectRatio: 1,
    resizeMode:'contain',
    marginLeft: 20,
  },
  itemImage: {
    width: "25%",
    aspectRatio: 1,
    resizeMode:'contain',
  },
  container: {
    flex: 1,
    //justifyContent: "center",
    // padding: 20,
  },
  content: {
    flex: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: 738,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    //maxHeight: 400,
  },
  home_buttons: {
  	height: 120,
  	margin: 20,
    width: 300,
    justifyContent: 'center'
  },
  home_buttons_mobile: {
    height: 120,
    margin: 20,
    //width: ' 90%'
  },
  short_text_input: {
    width: '90%',
    maxWidth: 500,
    marginTop: 15,

  },
  submit_button: { 
    marginTop: 20,
  },

});