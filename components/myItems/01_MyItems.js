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

const MyItems = () => {

  // Today's date
  const today = format(new Date(), "MMMM do, yyyy");

  // Date formatting
  const DateString = (eventDate) =>  {

    const date = new Date(eventDate);
    const formattedDate = format(date, "MMMM do, yyyy");
    return formattedDate;

  }

  // Number of events the user has
  const numEvents = fakeUserEventsItems.length;

  // Use event 3 as an example
  const eventIndex = 2;
  const activeEvent = fakeUserEventsItems[eventIndex].activeEvent;
  const location = fakeUserEventsItems[eventIndex].locationName;
  const eventStartDate = DateString(fakeUserEventsItems[eventIndex].startDatetime);

  // If the event date is today, display "Today's Event",
  // If event is active but not today, display "Next Event"
  let eventLine1 = "";
  if (activeEvent == true && eventStartDate == today) {
    eventLine1 = `Today's Event: ${location}`;
  } else if (activeEvent == true && eventStartDate != today) {
    eventLine1 = `Next Event: ${location}`;
  } else {
    eventLine1 = `${location}`;
  }

  // Item info for testing
  const itemName = fakeUserEventsItems[eventIndex].items[0].itemType.name;
  const itemImage = fakeUserEventsItems[eventIndex].items[0].itemType.imageUrl;

  // Status
  const rawItemStatus = fakeUserEventsItems[eventIndex].items[0].status;
  const itemRepairerName = fakeUserEventsItems[eventIndex].items[0].repairerName;
  let itemStatus = ""
  let viewRepairLog = "Repair log available when complete"
  if (rawItemStatus == "Waiting on Assignment"){
    itemStatus = rawItemStatus;
  } else if (rawItemStatus == "In Progress") {
    itemStatus = `Assigned to ${itemRepairerName}`;
  } else if (rawItemStatus == "Complete") {
    itemStatus = `Completed by ${itemRepairerName}`;
    viewRepairLog = "View Repair Log\nThank Repairer";
  } else {
    itemStatus = "Unknown";
  }

  return (
    <View style={styles.container}>

      <StatusBar style = "auto" />
      <Nav></Nav>

      <View style = {{alignItems: 'flex-start', justifyContent: 'center', flex: 1, margin: 20}}>
        <ScrollView>

          <Text>
            <Text style = {{ fontWeight: 'bold', fontSize: 16}}>{eventLine1}{"\n"}</Text>
            {eventStartDate}
          </Text>

          <Divider style={{ height: 2 }}/>

          <View style = {{margin: 5}}>
            <Button icon = "plus" mode = "elevated" textColor = "black">
            Add Item
            </Button>
          </View>

          <View style = {{borderWidth: 1, padding: 10, flex: 1, flexDirection: 'row'}}>
           <Image source={{ uri: itemImage }} style={styles.itemImage} />
           <View style = {{paddingLeft: 5, paddingRight: 5}}>
            <Text style = {{marginBottom: 3}}>
              {itemName.toUpperCase()}{"\n"}
              Status: {itemStatus}{"\n"}
              {viewRepairLog}
            </Text>
              <Button mode = "outlined" compact = "true" dark = "true" uppercase = "false">
              QR Code for Repairer
              </Button>
           </View>
          </View>

        </ScrollView>
      </View>
    </View>
    );

};

export default MyItems;