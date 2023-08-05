import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);

  console.log('isLogin:', isLogin);

  return (
    <View>
      <Text>Login</Text>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Login;