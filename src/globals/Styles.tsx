import { StyleSheet, Platform, Dimensions, TextStyle } from "react-native";
import { ImageStyle } from "react-native";
let mainFont = 'Futura';
if (Platform.OS === 'ios' || Platform.OS === 'android') {
    mainFont = 'system font';
}
let titleFont = 'Salsa-Regular';

export const selectionColor = '#246fb0';

export default StyleSheet.create({
    appBar: {
        backgroundColor: 'white',
        height: 60,
        maxWidth: 738,
        minWidth: 320,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        alignContent: 'center',
    },
    appBarTitle: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    logo: {
        height: 60,
        width: 60,
        marginLeft: 10,
    } as ImageStyle,
    itemImage: {
        width: "25%",
        aspectRatio: 1
    },
    topScrollView: {
        minHeight: '100%',
        overflow: 'visible',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,
        paddingHorizontal: 10,
    },
    content: {
        flex: 1,
        width: '100%',
        maxWidth: 738,
        minWidth: 320,
        paddingTop: 10,
        paddingHorizontal: 10,
        marginHorizontal: 'auto',
        marginBottom: 10,
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
    },
    short_text_input: {
        marginVertical: 5,
        flex: 1,
        backgroundColor: 'white',
    } as TextStyle,
    submitButton: {
        marginTop: 20,
        backgroundColor: '#246fb0',
        borderColor: '#1a5385',
    },
    deleteButton: {
        marginTop: 20,
        backgroundColor: '#c34a51',
        borderColor: '#7b0005',
    },
    submitButtonLabel: {
        color: 'white',
        paddingVertical: 15,
    },
    snackbar: {
        minWidth: 320,
        maxWidth: 738,
        alignSelf: 'center'
    },
    modalStyle: {
        backgroundColor: 'white',
        margin: 20,
        width: '50%',
        height: '80%',
        minWidth: 320,
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
        fontFamily: mainFont,
    },
    dropdownContainer: {
        paddingTop: 16,
        paddingBottom: 5,
        width: "100%",
        flex: 1,
    },
    dropdown: {
        backgroundColor: 'white',
        color: '#717171',
        height: 50,
        flex: 1,
        borderColor: 'black',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        fontFamily: mainFont,
    },
    icon: {
        marginRight: 5,
    },
    placeholderStyle: {
        fontSize: 16,
        color: '#49454f',
        fontFamily: mainFont,
        marginLeft: 5,
    },
    selectedTextStyle: {
        fontSize: 16,
        fontFamily: mainFont,
        color: '#1c1b1f',
        marginLeft: 5,
    },
    itemTextStyle: {
        fontSize: 16,
        fontFamily: mainFont,
        color: '#717171',
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
        fontFamily: mainFont,
        color: '#717171',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: '5%',
        bottom: 10,
        backgroundColor: '#96db73',
    },
    html: {
        p: {
            fontSize: 18
        },
        h2: {
            fontSize: 24,
            fontWeight: 'bold',
        }
    },
    bottomTab: {
        color: "black",
        backgroundColor: "red",
        flex: 1,
    },
});
