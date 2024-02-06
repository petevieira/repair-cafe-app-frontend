import { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import styles from '../globals/Styles'
import { getText } from '../requests/text-requests';
import { AuthContext } from '../contexts/auth-context';

const About = () => {
  const [aboutText, setAboutText] = useState('');
  const [state, setState] = useContext(AuthContext);

  const getAboutText = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await getText('about');
      setAboutText(response.data.text.content)
      setState({...state, showLoader: false});
    } catch (error) {
      console.error(error);
      setState({...state, snackbarMsg: error.message, showLoader: false});
    }
  }

  useEffect(() => {
    getAboutText();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <HTMLView
          stylesheet={styles.html}
          value={aboutText}
        />
      </View>
    </ScrollView>
  )
}

export default About;