import { View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import styles from './Styles.js'


const SubmitButton = () => (
   <Button mode="outlined" style={{
      //flex: props.flex_num,
      ...styles.submit_button, 
    }}>
    Submit
    </Button>
);

export default SubmitButton;