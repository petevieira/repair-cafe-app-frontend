import { useState, useEffect, useContext } from 'react';
import { View, ScrollView } from 'react-native';
import HTMLView from 'react-native-htmlview';

import styles from 'globals/Styles'
import { getText } from 'requests/text-requests';
import { useAuth } from 'contexts/auth-context';

const About = () => {
  const {
    showLoader, setShowLoader,
    snackbarMsg, setSnackbarMsg,
  } = useAuth();
  const [aboutText, setAboutText] = useState('');

  const getAboutText = async () => {
    setShowLoader(true);
    try {
      const response = await getText('about');
      setAboutText(response.data.text.content)
    } catch (error) {
      console.error(error);
      setSnackbarMsg(error.message);
    }
    setShowLoader(false);
  }

  useEffect(() => {
    getAboutText();
  }, []);

  return (
    <ScrollView
      contentContainerStyle={styles.topScrollView}
      style={{backgroundColor: '#f2f2f2'}}
    >
    <View style={[styles.content, { paddingHorizontal: 10 }]}>
      <HTMLView
        stylesheet={styles.html}
        value={aboutText}
      />
    </View>
    </ScrollView>
  )
}

export default About;