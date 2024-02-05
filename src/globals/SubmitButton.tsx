import { View, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import styles from './Styles'


const SubmitButton = (props) => {

  const { style, text, ...rest } = props;
  return (
    <Button {...rest}
      mode="outlined"
      style={[styles.submitButton, style]}
      labelStyle={styles.submitButtonLabel}
    >
      {text || "Submit"}
    </Button>
  )
};

export default SubmitButton;
