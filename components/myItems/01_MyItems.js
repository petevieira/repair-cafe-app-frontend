import { View, SafeAreaView, Platform, ScrollView, StatusBar, KeyboardAvoidingView, Image} from 'react-native';
import {
  Button,
  Divider,
  Paragraph,
  Dialog,
  Portal,
  Provider,
  TextInput,
  Text,
  BottomNavigation
} from 'react-native-paper';
import { format } from "date-fns";
// Custom Components
import Nav from "../../globals/Nav"
import SubmitButton from "../../globals/SubmitButton"
// Styles
import styles from '../../globals/Styles.js'
// Fake data
import fakeUserEventsItems from '../../images/example_user_events.json';

fakeUserEventsItems.sort((a, b) => (new Date(b.startDatetime)).getTime() - (new Date(a.startDatetime)).getTime());

const MyItems = () => {

  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");

  return (
    <View style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <View style = {{alignItems: 'flex-start', justifyContent: 'center', flex: 1, margin: 20}}>
        <ScrollView>
          {fakeUserEventsItems.map((event)=> {

            const eventStartDate = format(new Date(event.startDatetime), "MMMM do, yyyy");
            const activeEvent = event.activeEvent;
            const location = event.locationName;


            let eventLine1 = "";
            if (activeEvent == true && eventStartDate == today) {
              eventLine1 = `Today's Event: ${location}`;
            } else if (activeEvent == true && eventStartDate != today) {
              eventLine1 = `Next Event: ${location}`;
            } else {
              eventLine1 = `Past Event: ${location}`;
            }

            return (
              <View key={event.EventId}>

                <Text>
                <Text style = {{ fontWeight: 'bold', fontSize: 16}}>{eventLine1}{"\n"}</Text>
                {eventStartDate}
                </Text>

                <Divider style={{ height: 2 }}/>

                {event.items.map((item)=> {
                  return (
                    <Text key={item.itemId}>{item.itemType.name}</Text>
                  )
                })}

              </View>
            )
          })}
        </ScrollView>
      </View>
    </View>
    );

};

export default MyItems;