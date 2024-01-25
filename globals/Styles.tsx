import {StyleSheet} from "react-native";

export default StyleSheet.create({
  logo: {
    height: 60,
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
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 10,
    paddingRight: 10,
    minHeight: '80vh',
  },
  content: {
    // flex: 6,
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
    maxWidth: 738,
    alignItems: "center",
    // justifyContent: "center",
    alignSelf: "center",
    // marginTop: 10,
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
  modalStyle: {
    backgroundColor: 'white',
    padding: 20,
  },
  loader: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#717171',
    fontFamily: 'Futura',
  },
  dropdownContainer: {
    backgroundColor: 'white',
    padding: 16,
    width: "100%",
    maxWidth: 500,
    marginTop: 15
  },
  dropdown: {
    backgroundColor: '#f6f6f6',
    color: '#717171',
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: 'Futura',
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#717171',
    fontFamily: 'Futura',
  },
  selectedTextStyle: {
    fontSize: 16,
    fontFamily: 'Futura',
    color: 'black',
  },
  itemTextStyle: {
    fontSize: 16,
    fontFamily: 'Futura',
    color: '#717171',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    fontFamily: 'Futura',
    color: '#717171',
  },
  fab: {
    position: 'fixed',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#96db73',
  },
});