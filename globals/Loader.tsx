import * as React from 'react';
import { Portal, ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '../contexts/auth-context';

const Loader = () => {
  const [state, setState] = React.useContext(AuthContext);

  return (
    <Portal>
      <ActivityIndicator
        animating={state.showLoader}
        size="large"
        style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'}}
      />
    </Portal>
  )
};

export default Loader;