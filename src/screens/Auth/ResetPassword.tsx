import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import Strings from '../../localization';
import { SvgXml } from 'react-native-svg';
import Header from '../../components/Header';
import { Routes } from '../../types/navigation';
import Button from '../../components/Button';
import firebaseAuth from '../../services/firebase';
import TextEdit from '../../components/Input/TextEdit';
import { checkEmailValid } from '../../utils/Helper';
import { StackScreenProps } from '@react-navigation/stack';
import { MailBoxXML } from '../../components/Illustrations/MailBox';
import { MailSentXML } from '../../components/Illustrations/MailSent';
import { Layout, Typography, Spacing, Colors, Touchable } from '../../styles';
import { View, Text, Platform, Pressable, StatusBar, StyleSheet, KeyboardAvoidingView, NativeSyntheticEvent, ImageLoadEventData, Keyboard } from 'react-native';

const ResetPassword = ({ navigation, route }: StackScreenProps<Routes, 'ResetPassword'>): JSX.Element => {
  const [state, setState] = useState<'INPUT_MAIL' | 'VERIFY_CODE' | 'RESET_SUCCESS' | 'RESET_BY_FIREBASE'>('INPUT_MAIL');
  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const renderInputMail = (): JSX.Element => {
    return (
      <Pressable style={styles.content} onPress={Keyboard.dismiss}>
        <View style={styles.svgIllus}>
          <SvgXml xml={MailBoxXML} width="100%" height="100%" />
        </View>
        <KeyboardAvoidingView
          style={{ gap: Spacing.S }}
          behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        >
          <Text style={Typography.description}>{Strings.resetPassword.recoveryEmailHelper}</Text>
          <TextEdit
            value={email}
            placeholder={Strings.resetPassword.recoveryEmailPlaceholder}
            onChange={(text) => {
              setEmail(text)
              if (!isEmpty(emailError) && !isEmpty(text)) {
                setEmailError('')
              }
            }}
            errorText={emailError}
            isEdit={true}
            // onSubmit={handleSendEmail}
            autoCapitalize='none'
          />
        </KeyboardAvoidingView>
      </Pressable>
    )
  };

  const renderVerifyCode = () => {
    return (
      <View style={styles.content}>
        <View style={styles.svgIllus}>
          <SvgXml xml={MailSentXML} width="100%" height="100%" />
        </View>
        <KeyboardAvoidingView
          style={{ gap: Spacing.S }}
          behavior={Platform.OS == 'ios' ? 'padding' : undefined}
        >
          <Text style={Typography.description}>{Strings.resetPassword.recoveryEmailHelper}</Text>

        </KeyboardAvoidingView>
      </View>
    )
  };

  const renderResetSuccess = () => {
    return (
      <View style={styles.content}>

      </View>
    )
  };

  const renderResetByFirebase = () => {
    return (
      <View style={styles.content}>

      </View>
    )
  };

  const Content = (): JSX.Element => {
    switch (state) {
      case 'INPUT_MAIL':
        return renderInputMail();
      case 'VERIFY_CODE':
        return renderVerifyCode();
      case 'RESET_SUCCESS':
        return renderResetSuccess();
      case 'RESET_BY_FIREBASE':
        return renderResetByFirebase();
      default:
        return renderInputMail();
    }
  };

  const handleSendEmail = useCallback(() => {
    Keyboard.dismiss();

    if (isEmpty(email)) {
      setEmailError(Strings.resetPassword.emailRequired);
      return;
    }

    if (!checkEmailValid(email)) {
      setEmailError(Strings.resetPassword.emailInvalid);
      return;
    }

    // send verification code to email
    firebaseAuth.sendPasswordResetEmail(email)
      .then(() => {
        console.debug('~ sendPasswordResetEmail success')
        setState('RESET_BY_FIREBASE');
      })
      .catch((error) => {
        console.log('error:', error);
      })
      .finally(() => {
        console.log('finally');
      })

  }, [email]);

  const getBtnLabel = () => {
    switch (state) {
      case 'INPUT_MAIL':
        return Strings.resetPassword.sendBtn;
      case 'VERIFY_CODE':
        return Strings.resetPassword.verifyBtn;
      case 'RESET_SUCCESS':
        return Strings.resetPassword.resetSuccessBtn;
      case 'RESET_BY_FIREBASE':
        return Strings.resetPassword.backToLogin;
      default:
        return Strings.resetPassword.sendBtn;
    }
  };

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Login');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title={Strings.resetPassword.title} />

      {state === 'INPUT_MAIL' ?
        <Pressable style={styles.content} onPress={Keyboard.dismiss}>
          <View style={styles.svgIllus}>
            <SvgXml xml={MailBoxXML} width="100%" height="100%" />
          </View>
          <KeyboardAvoidingView
            style={{ gap: Spacing.S }}
            behavior={Platform.OS == 'ios' ? 'padding' : undefined}
          >
            <Text style={Typography.description}>{Strings.resetPassword.recoveryEmailHelper}</Text>
            <TextEdit
              value={email}
              placeholder={Strings.resetPassword.recoveryEmailPlaceholder}
              onChange={(text) => {
                setEmail(text)
                if (!isEmpty(emailError) && !isEmpty(text)) {
                  setEmailError('')
                }
              }}
              errorText={emailError}
              isEdit={true}
              onSubmit={handleSendEmail}
              autoCapitalize='none'
            />
          </KeyboardAvoidingView>
        </Pressable>
        : (
          <View style={[styles.content, { gap: Spacing.M }]}>
            <View style={styles.svgIllus}>
              <SvgXml xml={MailSentXML} width="100%" height="100%" />
            </View>
            <Text>{Strings.resetPassword.resetByFirebase}</Text>
            <Text style={Typography.description}>{Strings.resetPassword.resetByFirebaseDesc}</Text>
          </View>
        )}

      <View style={[Touchable.btnBottom]}>
        <Button label={getBtnLabel()} onPress={() => state === 'INPUT_MAIL' ? handleSendEmail() : state === 'RESET_BY_FIREBASE' ? handleGoBack() : {}} />
      </View>
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  content: {
    ...Layout.content,
    marginTop: Spacing.XL,
    paddingHorizontal: Spacing.horizontalPadding
  },
  svgIllus: {
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: Spacing.S
  },
});

export default ResetPassword;