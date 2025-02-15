import * as React from 'react';
import { View, SafeAreaView } from 'react-native';
import { Portal, ActivityIndicator } from 'react-native-paper';
import { useAuth } from 'contexts/auth-context';
import styles from 'globals/Styles'

const Loader = () => {
  const { showLoader } = useAuth();

  return (showLoader &&
    <View
      style={styles.loader}>
      <ActivityIndicator
        animating={showLoader}
        size="large"
      />
    </View>
  );
};

export default Loader;