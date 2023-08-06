import React, { useState, useRef } from 'react';
import Strings from '../../localization';
import Header from '../../components/Header';
import { ScreenProps } from '../../types/navigation';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from 'react-native';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import LabelInput from '../../components/Input/LabelInput';

const Register = ({ navigation, route }: ScreenProps): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  return (
    <View style={{ flex: 1 }}>
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
              />
              <LabelInput
                label={Strings.register.confirmPassword}
                value={confirmPassword}
                placeholder={Strings.register.confirmPasswordPlaceholder}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
    gap: Spacing.XL
  },
  form: {
    width: '100%',
  },
});

export default Register;