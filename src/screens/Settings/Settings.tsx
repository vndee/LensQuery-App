import React, { useEffect, useState } from 'react';
import { Routes } from '../../types/navigation';
import Button from '../../components/Button';
import auth from '@react-native-firebase/auth';
import Strings from '../../localization';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { clearStorageKeepAuth } from '../../storage';
import TextEdit from '../../components/Input/TextEdit';
import { setOpenaiKey } from '../../redux/slice/account';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import InlineOptionSheet, { InlineOptionSheetProps } from '../../components/ActionSheet/InlineOptionSheet';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';

const Settings = ({ navigation }: NativeStackScreenProps<Routes, 'Settings'>) => {
  const dispatch = useDispatch();
  const { openaiKey } = useSelector((state: any) => state.account);
  const [key, setKey] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyErrorText, setKeyErrorText] = useState<string>('');
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const [language, setLanguage] = useState<string>(Strings.getLanguage());
  const [email, setEmail] = useState<string>('');

  const handleLogout = () => {
    console.log('~ handleClearAll');
    clearStorageKeepAuth();
    // dispatch(setLogin(false));
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    if (openaiKey) {
      setKey(openaiKey);
    }
  }, [openaiKey]);

  const handleSaveKey = () => {
    setIsLoading(true);
    if (isEmpty(key)) {
      setKeyErrorText(Strings.onboardingSetup.keyEmptyError);
      return;
    }

    dispatch(setOpenaiKey(key));
    setIsEditing(false);
    setIsLoading(false);
  };

  const actionSheet: Array<ActionItemProps> = [
    {
      label: Strings.setting.actionChangeInformation,
      icon: 'person-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        setIsEditing(true);
      },
    },
    {
      label: Strings.setting.actionChangePassword,
      icon: 'lock-closed-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        navigation.navigate('ChangePassword');
      }
    },
    {
      label: Strings.setting.actionDeleteAccuont,
      icon: 'trash-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
      }
    },
    {
      label: Strings.setting.actionLogOut,
      icon: 'log-out-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        handleLogout();
      }
    }
  ];

  const languageOptions: Array<InlineOptionSheetProps> = [
    {
      label: 'English',
      value: 'en',
      onPress: () => { setLanguage('en'); Strings.setLanguage('en'); }
    },
    {
      label: 'Tiếng Việt',
      value: 'vi',
      onPress: () => { setLanguage('vi'); Strings.setLanguage('vi'); }
    }
  ];

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email || '');
      }
    });

    return subscriber;
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={[Layout.header, { paddingHorizontal: Spacing.XS }]}>
        <View style={Layout.row}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backIcon}>
            <Ionicons name="chevron-back" size={20} color={Colors.text_color} />
          </TouchableOpacity>
          <Text style={Typography.H3}>{Strings.setting.title}</Text>
        </View>
        <TouchableOpacity style={styles.moreIcon} onPress={() => actionSheetRef.current?.show()} disabled={isEditing}>
          <Feather name="more-vertical" size={20} color={Colors.text_color} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container}>
        <View>
          <TextEdit
            label={Strings.setting.email}
            value={email}
            onChange={setEmail}
            isEdit={isEditing}
          />
          <TextEdit
            value={key}
            label={Strings.onboardingSetup.labelInputKey}
            placeholder={Strings.onboardingSetup.pleasePasteOpenAIKey}
            onChange={(text) => {
              setKey(text);
              if (!isEmpty(keyErrorText) && !isEmpty(text)) {
                setKeyErrorText('');
              }
            }}
            errorText={keyErrorText}
            icon="key"
            isEdit={isEditing}
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
        </View>

        <InlineOptionSheet
          title={Strings.setting.language}
          options={languageOptions}
          selectedValue={language}
        />
      </ScrollView>

      {isEditing &&
        <View style={{ paddingHorizontal: Spacing.horizontalPadding }}>
          <Button label={Strings.onboardingSetup.saveBtn} onPress={handleSaveKey} style={styles.btnBottom} />
        </View>}

      <BottomActionSheet
        actionRef={actionSheetRef}
        actions={actionSheet}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    gap: Spacing.XL,
  },
  backIcon: {
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  row: {
    flex: 1,
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginBottom: Spacing.SAFE_BOTTOM,
  },
  moreIcon: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
});

export default Settings;