import { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import styles from './Styles'
import { getText } from '../requests/text-requests';
import { AuthContext } from '../contexts/auth-context';

const Terms = () => {
  const [terms, setTerms] = useState('');
  const [state, setState] = useContext(AuthContext);

  const getTerms = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await getText('terms');
      if (!response.status) {
        throw new Error(response.msg);
      }
      setTerms(response.data.text.content)
    } catch (err) {
      console.error(err);
    }
    setState({...state, showLoader: false});
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
          value={terms}
          style={styles.terms}
        />
      </View>
    </ScrollView>
  );
};

export default Terms;