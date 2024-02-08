import { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import styles from './Styles'
import { getText } from '../requests/text-requests';
import { useAuth } from '../contexts/auth-context';

const Terms = () => {
  const [terms, setTerms] = useState('');
  const {
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg,
  } = useAuth();

  const getTerms = async () => {
    setShowLoader(true);
    try {
      const response = await getText('terms');
      setTerms(response.data.text.content)
    } catch (error) {
      console.error(error);
      setSnackbar(error.message)
    }
    setShowLoader(false);
  }

  useEffect(() => {
    getTerms();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: 'white',
      }}
    >
      <View
        style={{paddingHorizontal: 10}}>
        <HTMLView
          stylesheet={styles.html}
          value={terms}
        />
      </View>
    </ScrollView>
  );
};

export default Terms;