import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../../components/Button';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);

  console.log('isLogin:', isLogin);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button label="Login" onPress={() => { }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});

export default Login;