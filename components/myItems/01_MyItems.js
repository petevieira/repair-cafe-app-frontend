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

      <View style = {{alignSelf: 'center', alignItems: 'flex-start', justifyContent: 'center', flex: 1, margin: 20}}>
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

            // Only add an "Add Item" button if the event is active
            // Note: More than one event can be active at a time
            function AddItemButton(props) {
              if (props.active == true) {
                return (
                  <View style = {{margin: 5, marginTop: 10, marginBottom: 2, display: 'flex', flexDirection: 'row', alignSelf: 'center'}}>
                    <Button icon = "plus" mode = "contained" buttonColor = "#DDDDDD">
                    Add Item
                    </Button>
                  </View>
                );
              };
            };

            return (
              <View key={event.eventId} style = {{marginBottom: 10}}>

                <Text>
                <Text style = {{ fontWeight: 'bold', fontSize: 16}}>{eventLine1}{"\n"}</Text>
                {eventStartDate}
                </Text>

                <Divider style={{ height: 1, backgroundColor: 'black', marginTop: 3}}/>

                <AddItemButton active = {activeEvent} />

                {event.items.map((item)=> {
                  // Item info
                  const itemName = item.itemType.name;
                  const itemImage = item.itemType.imageUrl;

                  // Status
                  const rawItemStatus = item.status;
                  const itemRepairerName = item.repairerName;
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

                  // Add QR code button if status is not complete
                  function QRCodeButton(props) {
                    if (props.itemStatus != "Complete") {
                      return (
                        <View style = {{display: 'flex', flexDirection: 'row'}}>
                          <Button mode = "outlined" compact = "true" dark = "true" uppercase = "false">
                          QR Code for Repairer
                          </Button>
                        </View>
                      );
                    };
                  };

                  return (

                    <View key = {item.itemId} style = {{padding: 10, flex: 1, flexDirection: 'row', marginTop: 3, marginBottom: 3}}>
                      <Image source={{ uri: itemImage }} style={styles.itemImage} />
                      <View style = {{paddingLeft: 7, paddingRight: 5}}>
                        <Text style = {{marginBottom: 3}}>
                          {itemName.toUpperCase()}{"\n"}
                          Status: {itemStatus}{"\n"}
                          {viewRepairLog}
                        </Text>
                        <QRCodeButton itemStatus = {rawItemStatus} />
                      </View>
                    </View>

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
