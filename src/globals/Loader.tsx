import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Portal, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../contexts/auth-context';
import styles from '../globals/Styles'

const Loader = () => {
  const [state, setState] = React.useContext(AuthContext);

  return (state.showLoader ?
    <ActivityIndicator
      animating={state.showLoader}
      size="large"
      style={styles.loader}
    />
    : <></>
  );
};

export default Loader;