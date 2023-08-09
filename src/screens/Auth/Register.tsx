import React, { useState, useRef } from 'react';
import Strings from '../../localization';
import Header from '../../components/Header';
import { ScreenProps } from '../../types/navigation';
import { Colors, Spacing, Layout, Typography, Touchable } from '../../styles';
import Button from '../../components/Button';
import { Routes } from '../../types/navigation';
import LabelInput from '../../components/Input/LabelInput';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView, TouchableOpacity } from 'react-native';

const Register = ({ navigation, route }: NativeStackScreenProps<Routes, 'Register'>): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title={Strings.register.title} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS == 'ios' ? 'padding' : undefined}
      >
        <ScrollView>
          <View>
            <View style={styles.form}>
              <LabelInput
                label={Strings.register.name}
                value={name}
                placeholder={Strings.register.namePlaceholder}
                onChangeText={setName}
              />
              <LabelInput
                label={Strings.register.email}
                value={email}
                placeholder={Strings.register.emailPlaceholder}
                onChangeText={setEmail}
              />
              <LabelInput
                label={Strings.register.password}
                value={password}
                placeholder={Strings.register.passwordPlaceholder}
                onChangeText={setPassword}
                secureTextEntry={true}
                icon="lock-closed-outline"
                iconView="lock-open-outline"
              />
              <LabelInput
                label={Strings.register.confirmPassword}
                value={confirmPassword}
                placeholder={Strings.register.confirmPasswordPlaceholder}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
                icon="lock-closed-outline"
                iconView="lock-open-outline"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={styles.disclaimer}>
        <Text style={{ ...Typography.description, textAlign: 'center' }}>{Strings.register.disclaimer}</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.terms}</Text>
          </TouchableOpacity>
          <Text style={{ ...Typography.description, textAlign: 'center' }}> {Strings.register.and} </Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={{ ...Typography.description, textAlign: 'center', color: Colors.primary }}>{Strings.register.privacy}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Button label={Strings.register.registerBtn} onPress={() => { }} style={styles.btn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
    gap: Spacing.XL
  },
  content: {
    width: '100%',
    paddingHorizontal: Spacing.S,
  },
  form: {
    width: '100%',
  },
  btn: {
    marginHorizontal: Spacing.horizontalPadding,
    marginBottom: Spacing.XL
  },
  disclaimer: {
    justifyContent: 'center',
    marginBottom: Spacing.M
  }
});

export default Register;