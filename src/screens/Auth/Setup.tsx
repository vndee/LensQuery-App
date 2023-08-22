import React, { useState, useRef } from 'react';
import { Routes } from '../../types/navigation';
import Strings from '../../localization';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import LabelInput from '../../components/Input/LabelInput';
import Button from '../../components/Button';
import { isEmpty } from 'lodash';
import { useDispatch } from 'react-redux';
import firebaseAuth from '../../services/firebase'
import { setOpenaiKey } from '../../redux/slice/account';
import { StackScreenProps } from '@react-navigation/stack';
import { Spacing, Typography, Layout, Colors } from '../../styles';


const OnboardingSetup = ({ navigation, route }: StackScreenProps<Routes, 'OnboardingSetup'>): JSX.Element => {
  const dispatch = useDispatch();
  const { email, password } = route.params;

  const [key, setKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyErrorText, setKeyErrorText] = useState<string>('');

  const handleSaveKey = () => {
    setIsLoading(true);
    if (isEmpty(key)) {
      setKeyErrorText(Strings.onboardingSetup.keyEmptyError);
      return;
    }

    dispatch(setOpenaiKey(key));
    firebaseAuth.signInWithEmailAndPassword(email, password).then((userCredential) => {
      console.debug('creds', userCredential);
      navigation.navigate('Lens');
    }).catch((error) => {
      console.debug('error', error);
      Alert.alert(
        Strings.onboardingSetup.alertErrorTitle,
        Strings.onboardingSetup.alertErrorMessage,
        [
          {
            text: Strings.onboardingSetup.alertErrorClose,
            onPress: () => console.log("Cancel Pressed"),
          },
          {
            text: Strings.onboardingSetup.alertErrorRetry,
            onPress: () => {
              handleSaveKey();
            }
          }
        ]
      )
    });
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      <LabelInput
        value={key}
        label={Strings.onboardingSetup.labelInputKey}
        placeholder={Strings.onboardingSetup.pleasePasteOpenAIKey}
        onChangeText={(text) => {
          setKey(text);
          if (!isEmpty(keyErrorText) && !isEmpty(text)) {
            setKeyErrorText('');
          }
        }}
        errorText={keyErrorText}
        icon="key"
      />
      <View style={{ gap: Spacing.S }}>
        <View style={styles.instruction}>
          <Text style={Typography.description}>{Strings.onboardingSetup.dontKnowHowToGetKey}</Text>
          <TouchableOpacity onPress={() => { }}>
            <Text style={[Typography.description, { color: Colors.primary }]}> {Strings.common.clickHere}</Text>
          </TouchableOpacity>
        </View>
        <Text style={Typography.description}>{Strings.onboardingSetup.disclaimer}</Text>
      </View>
      <Button label={Strings.onboardingSetup.saveBtn} onPress={handleSaveKey} style={styles.btnBottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    justifyContent: 'center',
    // gap: Spacing.XL
  },
  instruction: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  btnBottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignSelf: 'center',
    marginBottom: Spacing.XL
  }
});

export default OnboardingSetup;