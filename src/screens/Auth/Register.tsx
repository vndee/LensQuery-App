import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenProps } from '../../types/navigation';
import Header from '../../components/Header';

const Register = ({ navigation, route }: ScreenProps): JSX.Element => {
  return (
    <View>
      <Header />
      <Text>Register</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Register;