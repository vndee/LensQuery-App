import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Spacing, Typography, Layout } from '../../styles/index';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import Storage from '../../storage';
import Button from '../../components/Button';
import { setLogin } from '../../redux/slice/auth';
import TextInputWithIcon from '../../components/Input';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Login = (): JSX.Element => {
  const dispatch = useDispatch();
  const { isLogin } = useSelector((state: any) => state.auth);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  console.log('~ isLogin:', isLogin);

  const handleLogin = () => {
    dispatch(setLogin(true));
    Storage.set('isLogin', true);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInputWithIcon
        icon="mail-outline"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <Button label="Login" onPress={handleLogin} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
  },
});

export default Login;