import { useState, useEffect, useContext } from 'react';
import { Text, View, ScrollView } from 'react-native';
import styles from '../globals/Styles'
import HTMLView from 'react-native-htmlview';
import { getText } from '../requests/text-requests';
import { AuthContext } from '../contexts/auth-context';

const About = () => {

  const [aboutText, setAboutText] = useState('');
  const [state, setState] = useContext(AuthContext);

  const getAboutText = async () => {
    setState({...state, showLoader: true});
    try {
      const response = await getText('about');
      if (!response.status) {
        throw new Error(response.msg);
      }
      setAboutText(response.data.text.content)
    } catch (err) {
      console.error(err);
    }
    setState({...state, showLoader: false});
  }

  useEffect(() => {
    getAboutText();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.content}>
        <HTMLView
          value={aboutText}
        />
      </View>
    </ScrollView>
  )
}

export default About;