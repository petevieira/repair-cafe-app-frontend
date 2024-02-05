import { useState, useEffect, useContext } from 'react';
import { ScrollView, View } from 'react-native';
import HTMLView from 'react-native-htmlview';
import styles from './Styles'
import { getText } from '../requests/text-requests';
import { AuthContext } from '../contexts/auth-context';

const offlineTerms =
`
<div>
  <h2>Tucson Repair Café/Library Liability Waiver</h2>
  <h4>Acknowledgement of Risk or Injury Possibility</h4>
  As a participant or volunteer in the program, I recognize the risk and acknowledge that there are certain risks of physical injury – including death, damages, property damage, or loss – which I may sustain as a result of participating in any and all activities connected with the program, or the use of the facilities or equipment.
  </br>
  <h4>Waiver of Claim for Injury Clause</h4>
  I agree to waive and relinquish all claims that I may have for injuries or damages as a result of participating in the program or using the facilities or equipment against nonprofit organization and its officers, agents, servants, employees, other volunteers, and affiliates.
  </br>
  <h4>Release from Liability Clause</h4>
  I do hereby release and discharge nonprofit organization and its officers, agents, servants, employees, volunteers and affiliates from any and all claims for injuries, including death, damages, property damage, or loss which may have or may in future accrue to me in account of participating in or volunteering for the nonprofit organization.
  </br>
  <h4>Indemnity and Defense Clause</h4>
  I further agree to indemnify and hold harmless and pay defense costs and defend the nonprofit organization and its agents, servants, employees, other volunteers, and affiliates, from any and all claims resulting from injuries – including death, damages, property damage, or loss – sustained by me and arising out of, connected with, or in any way associated with the activities of the program or the use of facilities or equipment.
  <p>
    <i><span style="font-weight:normal;text-decoration:none">By checking the box, you are agreeing to the terms of the waiver.</span></i>
  </p>
</div>
`;

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