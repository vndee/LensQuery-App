import { isEmpty } from 'lodash';
import React, { useState } from 'react';
import Strings from '../../localization';
import { useDispatch } from 'react-redux';
import Button from '../../components/Button';
import { useRealm } from '../../storage/realm';
import { Routes } from '../../types/navigation';
import { IAppConfig } from '../../types/config';
import firebaseAuth from '../../services/firebase';
import LabelInput from '../../components/Input/LabelInput';
import { StackScreenProps } from '@react-navigation/stack';
import { getPressableStyle } from '../../styles/Touchable';
import { Spacing, Typography, Layout, Colors } from '../../styles';
import { View, Text, StyleSheet, Alert, Pressable } from 'react-native';


const OnboardingSetup = ({ navigation, route }: StackScreenProps<Routes, 'OnboardingSetup'>): JSX.Element => {
  const realm = useRealm();
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

    realm.write(() => {
      const appConf: IAppConfig = {
        userToken: firebaseAuth.currentUser?.uid || '',
        openaiKey: key,
      };
      realm.create('AppConfig', appConf);
    });

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
          <Pressable onPress={() => { }} style={getPressableStyle}>
            <Text style={[Typography.description, { color: Colors.primary }]}> {Strings.common.clickHere}</Text>
          </Pressable>
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