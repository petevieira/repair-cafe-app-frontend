import { View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import styles from './Styles.js'


const ResponsiveButton = (props) => (
   <Button mode="outlined" style={{
      //flex: props.flex_num,
      ...styles.home_buttons, 
      ...Platform.select({
        ios: styles.home_buttons_mobile, 
        android: styles.home_buttons_mobile,
      }),
    }}>
    {props.button_text}
    </Button>
);

export default ResponsiveButton;