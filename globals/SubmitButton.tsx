import { View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import styles from './Styles'


const SubmitButton = (props) => (
   <Button {...props} mode="outlined" style={{
      //flex: props.flex_num,
      ...styles.submit_button,
    }}>
      {props.text || "Submit"}
    </Button>
);

export default SubmitButton;
