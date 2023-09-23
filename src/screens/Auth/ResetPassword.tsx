import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { isEmpty } from 'lodash';
import Strings from '../../localization';
import { SvgXml } from 'react-native-svg';
import Header from '../../components/Header';
import { Routes } from '../../types/navigation';
import Button from '../../components/Button';
import firebaseAuth from '../../services/firebase';
import TextEdit from '../../components/Input/TextEdit';
import { checkEmailValid, unixToTime } from '../../utils/Helper';
import { StackScreenProps } from '@react-navigation/stack';
import { MailBoxXML } from '../../components/Illustrations/MailBox';
import { MailSentXML } from '../../components/Illustrations/MailSent';
import TextInputWithIcon from '../../components/Input/TextInputWithIcon';
import { Layout, Typography, Spacing, Colors, Touchable } from '../../styles';
import { requestResetPassword, verifyResetPasswordCode } from '../../services/api';
import { View, Text, Platform, Pressable, StyleSheet, KeyboardAvoidingView, Keyboard, Alert } from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

const CELL_COUNT = 6;

const ResetPassword = ({ navigation, route }: StackScreenProps<Routes, 'ResetPassword'>): JSX.Element => {
  const [state, setState] = useState<'INPUT_MAIL' | 'VERIFY_CODE' | 'CHANGE_PASSWORD' | 'RESET_SUCCESS' | 'RESET_BY_FIREBASE'>('CHANGE_PASSWORD');
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>('');
  const [expireAt, setExpireAt] = useState<string>("10:57 PM");

  const [value, setValue] = useState('');
  const [codeError, setCodeError] = useState<string>('');
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<string>('');

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
          {!isEmpty(expireAt) && <Text style={Typography.description}>{Strings.resetPassword.expireAt} {expireAt}</Text>}

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={(text) => {
              if (!isEmpty(codeError) && !isEmpty(text)) {
                setCodeError('')
              }
              setValue(text)
            }}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell, !isEmpty(codeError) && { borderColor: Colors.danger }]}
                onLayout={getCellOnLayoutHandler(index)}>
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />

          {!isEmpty(codeError) && <Text style={styles.codeError}>{codeError}</Text>}
        </KeyboardAvoidingView>
      </View>
    )
  };

  const renderChangePassword = () => {
    return (
      <View style={[styles.content, { gap: Spacing.S }]}>
        <View style={{ paddingHorizontal: Spacing.XS }}>
          <Text style={Typography.body}>{Strings.resetPassword.newPasswordLabel}</Text>
          <Text style={[Typography.description, { color: Colors.second_text_color }]}>{Strings.resetPassword.newPasswordHelper}</Text>
        </View>
        <TextInputWithIcon
          value={newPassword}
          placeholder={Strings.resetPassword.newPasswordPlaceholder}
          onChangeText={(text: string) => {
            setNewPassword(text)
            if (!isEmpty(newPasswordError) && !isEmpty(text)) {
              setNewPasswordError('')
            }
          }}
          errorText={newPasswordError}
          isEdit={true}
          autoCapitalize='none'
          secureTextEntry={true}
          onSubmitEditing={() => Keyboard.dismiss()}
          icon="lock-open-outline"
          iconView="lock-closed-outline"
        />
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
      case 'CHANGE_PASSWORD':
        return renderChangePassword();
      case 'RESET_SUCCESS':
        return renderResetSuccess();
      case 'RESET_BY_FIREBASE':
        return renderResetByFirebase();
      default:
        return renderInputMail();
    }
  };

  const handleSendEmail = useCallback(async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    if (isEmpty(email)) {
      setEmailError(Strings.resetPassword.emailRequired);
      return;
    }

    if (!checkEmailValid(email)) {
      setEmailError(Strings.resetPassword.emailInvalid);
      return;
    }

    const resp = await requestResetPassword(email);
    if (resp.status === 202) {
      console.log('resp.data', resp.data)
      setExpireAt(unixToTime(resp.data))
      setState('VERIFY_CODE');
    } else {
      setEmailError(Strings.common.unknownError);
    }

    setIsLoading(false);
  }, [email]);

  const handleVerifyCode = useCallback(async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    if (isEmpty(value)) {
      setCodeError(Strings.resetPassword.codeRequired);
      setIsLoading(false);
      return;
    }

    const resp = await verifyResetPasswordCode(email, value);
    if (resp === 200) {
      setState('RESET_SUCCESS');
    } else if (resp === 401) {
      setCodeError(Strings.resetPassword.codeInvalid);
    } else {
      setCodeError(Strings.common.unknownError);
    }

    setIsLoading(false);
  }, [email, value]);

  const handleChangePassword = useCallback(async () => {
    Keyboard.dismiss();
    setIsLoading(true);

    if (isEmpty(newPassword)) {
      setNewPasswordError(Strings.resetPassword.newPasswordInvalid);
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setNewPasswordError(Strings.resetPassword.newPasswordInvalid);
      setIsLoading(false);
      return;
    }

    Alert.alert(
      Strings.common.alertTitle,
      Strings.resetPassword.resetPasswordSuccess,
      [
        {
          text: Strings.resetPassword.backToLogin,
          onPress: () => handleGoBack(),
        }
      ]
    );

    setIsLoading(false);
  }, [newPassword]);

  const getBtnLabel = () => {
    switch (state) {
      case 'INPUT_MAIL':
        return Strings.resetPassword.sendBtn;
      case 'VERIFY_CODE':
        return Strings.resetPassword.verifyBtn;
      case 'CHANGE_PASSWORD':
        return Strings.resetPassword.changePasswordBtn;
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
        : state === 'VERIFY_CODE' ? renderVerifyCode()
          : state === 'CHANGE_PASSWORD' ? renderChangePassword() : null}

      <View style={[Touchable.btnBottom]}>
        <Button label={getBtnLabel()} onPress={() => state === 'INPUT_MAIL' ? handleSendEmail()
          : state === 'VERIFY_CODE' ? handleVerifyCode()
            : state === 'CHANGE_PASSWORD' ? handleChangePassword() : {}} isLoading={isLoading} />
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
  root: { flex: 1, padding: 20 },
  title: { textAlign: 'center', fontSize: 30 },
  codeFieldRoot: {
    marginTop: Spacing.M,
    gap: Spacing.M,
    justifyContent: 'center',
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderWidth: 2,
    borderRadius: Spacing.S,
    borderColor: Colors.pale_blue,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  focusCell: {
    borderColor: Colors.primary,
  },
  codeError: {
    ...Typography.description,
    color: Colors.danger,
    textAlign: 'center',
  }
});

export default ResetPassword;