import * as React from 'react';
import { View, Platform, Pressable, Text } from 'react-native';
import { Checkbox } from 'react-native-paper';

function CheckBox({ label, status, onPress }) {
    return (
        <Pressable onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
        { Platform.OS === 'ios' &&
            <View style={{borderColor: 'lightgray', borderWidth: 2, borderRadius: 5, marginRight: 10 }}>
            <Checkbox status={status} />
            </View>
        }
        { Platform.OS !== 'ios' &&
            <Checkbox status={status} />
        }
        <Text style={{ fontWeight: 'bold' }}>{label}</Text>
        </View>
        </Pressable>
    );
}

export default CheckBox;