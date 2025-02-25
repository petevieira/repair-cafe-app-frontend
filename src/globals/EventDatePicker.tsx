import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { TextInput } from "react-native-paper";
import styles from 'globals/Styles'

const EventDatePicker = ({ eventDate, setEventDate }) => {
    console.debug("EventDatePicker eventDate: ", eventDate);
    const initialDate = eventDate ? new Date(eventDate) : new Date();
    initialDate.setUTCHours(0, 0, 0, 0);
    console.debug("EventDatePicker initialDate: ", initialDate);
    const [year, setYear] = useState(initialDate.getUTCFullYear().toString());
    const [month, setMonth] = useState((initialDate.getUTCMonth() + 1).toString().padStart(2, '0'));
    const [day, setDay] = useState(initialDate.getUTCDate().toString().padStart(2, '0'));
    const [yearValid, setYearValid] = useState(true);
    const [dayValid, setDayValid] = useState(true);
    const [monthValid, setMonthValid] = useState(true);
    const margin = 10;
    let yearInputRef = React.createRef();

    const setDate = (year: string, month: string, day: string) => {
        let date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        date.setUTCHours(0, 0, 0, 0);
        setEventDate(date);
    }

    const validateYear = (newYear: string) => {
        // Ensure 4 digits and doesn't start with 0
        const yearRegex = /^[1|2][0-9][0-9][0-9]$/;
        if (newYear !== "") {
            setYearValid(yearRegex.test(newYear));
            setDate(newYear, month, day);
        }
    }

    const validateMonth = (newMonth: string) => {
        // Pad month with 0 if only 1 digit
        if (newMonth.length === 1) {
            newMonth = `0${newMonth}`;
        }
        setMonth(newMonth);
        // Regex for month validation
        const monthRegex = /^(0[1-9]|1[0-2])$/;
        setMonthValid(monthRegex.test(newMonth));
        setDate(year, newMonth, day);
    }

    const validateDay = (newDay: string) => {
        // Pad day with 0 if only 1 digit
        if (newDay.length === 1) {
            newDay = `0${newDay}`;
        }
        setDay(newDay);
        // Regex for day validation also based on month
        const dayRegex = {
            "01": /^(0[1-9]|1\d|2[0-8]|3[0-1])$/,
            "02": /^(0[1-9]|1\d|2[0-9])$/,
            "03": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
            "04": /^(0[1-9]|1\d|2[0-9]|3[0])$/,
            "05": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
            "06": /^(0[1-9]|1\d|2[0-9]|3[0])$/,
            "07": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
            "08": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
            "09": /^(0[1-9]|1\d|2[0-9]|3[0])$/,
            "10": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
            "11": /^(0[1-9]|1\d|2[0-9]|3[0])$/,
            "12": /^(0[1-9]|1\d|2[0-9]|3[0-1])$/,
        };
        let valid = true;
        if (!!month) {
            const dayRegexMatch = dayRegex[month];
            valid = dayRegexMatch.test(newDay);
            setDayValid(valid);
        } else if (month === "") {
            valid = true;
            setDayValid(valid);
        }
        if (valid) {
            // Set event date
            setDate(year, month, newDay);
        }
    }

    useEffect(() => {
        yearInputRef.current.focus();
    }, []);

    return (
        <View style={{flexDirection: 'row'}}>
            <TextInput
                label="Event Year (YYYY)"
                mode="outlined"
                autoCorrect={false}
                style={{
                    ...styles.short_text_input,
                    marginHorizontal: margin,
                    backgroundColor: yearValid ? 'white' : 'rgba(240, 128, 128, 0.25)'
                }}
                value={year}
                ref={yearInputRef}
                inputMode="numeric"
                maxLength={4}
                onChangeText={newYear => {
                    // Only allow 1 though 12 using regex
                    setYear(newYear.replace(/\D/g, ''));
                }}
                onBlur={() => validateYear(year)}
            />
            <TextInput
                label="Event Month (MM)"
                mode="outlined"
                autoCorrect={false}
                style={{
                    ...styles.short_text_input,
                    marginHorizontal: margin,
                    backgroundColor: monthValid ? 'white' : 'rgba(240, 128, 128, 0.25)'
                }}
                value={month}
                inputMode="numeric"
                maxLength={2}
                onChangeText={newMonth => setMonth(newMonth.replace(/\D/g, ''))}
                onBlur={() => validateMonth(month)}
            />
            <TextInput
                label="Event Day (DD)"
                mode="outlined"
                autoCorrect={false}
                style={{
                    ...styles.short_text_input,
                    marginHorizontal: margin,
                    backgroundColor: dayValid ? 'white' : 'rgba(240, 128, 128, 0.25)'
                }}
                value={day}
                maxLength={2}
                inputMode="numeric"
                onChangeText={newDay => setDay(newDay.replace(/\D/g, ''))}
                onBlur={() => validateDay(day)}

            />
        </View>
    );
};

export default EventDatePicker;
