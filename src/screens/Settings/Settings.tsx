import React, { useEffect, useState } from 'react';
import { Routes } from '../../types/navigation';
import Button from '../../components/Button';
import auth from '@react-native-firebase/auth';
import Strings from '../../localization';
import { isEmpty } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import TextEdit from '../../components/Input/TextEdit';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { setLanguage } from '../../redux/slice/auth';
import { maskApiKey } from '../../utils/Helper';
import { checkValidApiKey } from '../../services/openai';
import { useRealm, useObject } from '../../storage/realm';
import { IAppConfig } from '../../types/config';
import { getPressableStyle } from '../../styles/Touchable';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import InlineOptionSheet, { InlineOptionSheetProps } from '../../components/ActionSheet/InlineOptionSheet';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';

const Settings = ({ navigation }: StackScreenProps<Routes, 'Settings'>) => {
  const realm = useRealm();
  const dispatch = useDispatch();
  const [key, setKey] = useState<string>('');
  const { userToken, language } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyErrorText, setKeyErrorText] = useState<string>('');
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const openaiKeyObj = useObject<IAppConfig>('AppConfig', userToken);
  const [email, setEmail] = useState<string>('');

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    if (openaiKeyObj) {
      setKey(openaiKeyObj.openaiKey || '');
    }
  }, [openaiKeyObj]);

  const handleSaveKey = async () => {
    setIsLoading(true);
    if (isEmpty(key)) {
      setKeyErrorText(Strings.onboardingSetup.keyEmptyError);
      return;
    }

    const isValidKey = await checkValidApiKey(key);
    if (!isValidKey) {
      setKeyErrorText(Strings.onboardingSetup.keyInvalidError);
      return;
    }

    realm.write(() => {
      if (!openaiKeyObj) {
        realm.create('AppConfig', {
          userToken,
          openaiKey: key,
        });
      } else {
        openaiKeyObj.openaiKey = key;
      }
    })
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
      onPress: () => { dispatch(setLanguage('en')); }
    },
    {
      label: 'Tiếng Việt',
      value: 'vi',
      onPress: () => { dispatch(setLanguage('vi')); }
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
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[Layout.header, { paddingHorizontal: Spacing.horizontalPadding }]}>
        <View style={Layout.row}>
          <Pressable onPress={navigation.goBack} style={getPressableStyle} hitSlop={20}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>
          <Text style={[Typography.H3, { marginLeft: Spacing.XS, color: Colors.white }]}>{Strings.setting.title}</Text>
        </View>
        <Pressable style={getPressableStyle} onPress={() => actionSheetRef.current?.show()} disabled={isEditing} hitSlop={20}>
          <Feather name="more-vertical" size={20} color={Colors.white} />
        </Pressable>
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
            value={isEditing ? key : maskApiKey(key)}
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
              <Pressable onPress={() => { }} style={getPressableStyle} hitSlop={20}>
                <Text style={[Typography.description, { color: Colors.primary }]}> {Strings.common.clickHere}</Text>
              </Pressable>
            </View>
            <Text style={Typography.description}>{Strings.onboardingSetup.disclaimer}</Text>
          </View>
        </View>

        <View style={{ height: Spacing.XL }} />

        <InlineOptionSheet
          title={Strings.setting.language}
          options={languageOptions}
          selectedValue={language}
        />
      </ScrollView>

      {isEditing &&
        <View style={styles.footer}>
          <Button label={Strings.common.cancel} onPress={() => setIsEditing(false)} style={styles.btnBottom} outline={true} />
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
    marginTop: Spacing.L,
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
  footer: {
    gap: Spacing.M,
    flexDirection: 'row',
    marginBottom: Spacing.M,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontalPadding,
  },
  btnBottom: {
    flex: 1,
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