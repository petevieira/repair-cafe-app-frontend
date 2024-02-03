import {StyleSheet} from "react-native";

export default StyleSheet.create({
  appBar: {
    backgroundColor: 'white',
    // maxWidth: 600,
    // marginLeft: 'auto',
    // marginRight: 'auto'
  },
  appBarTitle: {
    fontFamily: 'Futura',
    fontSize: 24,
    fontWeight: 'bold',
    alignText: "center"
  },
  logo: {
    // position: 'absolute',
    // left: 2,
    height: 60,
    aspectRatio: 1,
  },
  itemImage: {
    width: "25%",
    aspectRatio: 1
  },
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    paddingHorizontal: 10,
    minHeight: '80vh',
  },
  content: {
    maxWidth: 738,
    minWidth: 320,
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
    // minWidth: 320,
    // maxWidth: 500,
  },
  submitButton: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: '#246fb0',
    borderColor: '#1a5385',
  },
  submitButtonLabel: {
    color: 'white',
  },
  snackbar: {
    minWidth: 320,
    maxWidth: 738,
    alignSelf: 'center'
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
    bottom: 60,
    backgroundColor: '#96db73',
  },
});