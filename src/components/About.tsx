import React, { Component } from 'react';
import { Text, View } from 'react-native';
import styles from '../globals/Styles'

const About = () => {

  return (
    <View style={{margin: 15}}>
      <Text style={{ fontWeight: 'bold', fontSize: 22, marginBottom: 15, alignSelf: 'center'}}>Tucson Repair Cafe</Text>

      <Text style={{fontSize: 18}}>
        {"The Tucson Repair Cafe began when Sustainable Tucson Zero Waste Committee members Rocky Baier and Stephen Menke teamed up to make positive change in Tucson. Our first event was November 13th, 2021, and we are continuing to grow. \n\nOur mission is to:\n\n"}
      </Text>
      <View style={{ textAlign: 'left'}}>
        <Text style={{fontSize: 18}}>{'\u2022'} Reduce local landfill waste</Text>
        <Text style={{fontSize: 18}}>{'\u2022'} Give items a new life</Text>
        <Text style={{fontSize: 18}}>{'\u2022'} Empower Tucson citizens to be self-reliant</Text>
        <Text style={{fontSize: 18}}>{'\u2022'} Create a place for people to connect and share skills</Text>
      </View>
    </View>
  )
}

export default About;