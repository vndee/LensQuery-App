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
import { StackScreenProps } from '@react-navigation/stack';
import { setLanguage } from '../../redux/slice/auth';
import { maskApiKey } from '../../utils/Helper';
import { IAppConfig } from '../../types/chat';
import { getKeyLimit } from '../../services/openrouter';
import { checkValidApiKey } from '../../services/openai';
import { useRealm, useObject } from '../../storage/realm';
import { getPressableStyle } from '../../styles/Touchable';
import LineData from '../../components/Information/LineData';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { TGetKeyLimitResponse, TGetModelPropertiesResponse } from '../../types/openrouter';
import InlineOptionSheet, { InlineOptionSheetProps } from '../../components/ActionSheet/InlineOptionSheet';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';

const defaultOpenRouterModel: TGetModelPropertiesResponse = {
  id: "openai/gpt-3.5-turbo",
  pricing: {
    prompt: 0.0000015,
    completion: 0.000002
  },
  context_length: 4095,
  per_request_limits: {
    prompt_tokens: 2976803,
    completion_tokens: 2232602
  }
};

const defaultOpenAIModel: TGetModelPropertiesResponse = {
  id: "gpt-3.5-turbo",
  pricing: {
    prompt: 0.0000015,
    completion: 0.000002
  },
  context_length: 4095,
  per_request_limits: {
    prompt_tokens: 2976803,
    completion_tokens: 2232602
  }
};

const Settings = ({ navigation }: StackScreenProps<Routes, 'Settings'>) => {
  const realm = useRealm();
  const dispatch = useDispatch();
  const [key, setKey] = useState<string>('');
  const { userToken, language } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyErrorText, setKeyErrorText] = useState<string>('');
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const providerActionSheetRef = React.useRef<ActionSheetRef>(null);
  const appConf = useObject<IAppConfig>('AppConfig', userToken);
  const [email, setEmail] = useState<string>('');
  const [selectedProvider, setSelectedProvider] = useState<string>(appConf?.defaultProvider || 'OpenAI');
  const [openRouterKeyInfo, setOpenRouterKeyInfo] = useState<TGetKeyLimitResponse | null>(null);
  const [selectedDefaultModel, setSelectedDefaultModel] = useState<TGetModelPropertiesResponse | null>(null);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  useEffect(() => {
    if (appConf) {
      if (appConf.defaultProvider === 'OpenAI') {
        setKey(appConf?.openAI?.apiKey || '');
      } else if (appConf.defaultProvider === 'OpenRouter') {
        setKey(appConf?.openRouter?.apiKey || '');
      }
    }
  }, [appConf]);

  useEffect(() => {
    if (appConf) {
      if (selectedProvider === 'OpenAI') {
        setKey(appConf?.openAI?.apiKey || '');
      } else {
        setKey(appConf?.openRouter?.apiKey || '');
      }
    }
  }, [selectedProvider]);

  const handleSaveOpenAIKey = async (key: string) => {
    const isValidKey = await checkValidApiKey(key);
    if (!isValidKey) {
      setKeyErrorText(Strings.onboardingSetup.keyInvalidError);
      return;
    }

    realm.write(() => {
      if (!appConf) {
        const newRecord: IAppConfig = {
          userToken: userToken,
          defaultProvider: 'OpenAI',
          openAI: {
            apiKey: key,
            defaultModel: JSON.stringify(defaultOpenAIModel)
          },
          openRouter: {
            apiKey: '',
            defaultModel: ''
          }
        }
        realm.create('AppConfig', newRecord);
      } else {
        if (appConf.openAI) {
          appConf.openAI.apiKey = key;
          appConf.defaultProvider = 'OpenAI';
          appConf.openAI.defaultModel = JSON.stringify(defaultOpenAIModel);
        }
      }
    });
  };

  const handleSaveOpenRouterKey = async (key: string) => {
    const { status, data } = await getKeyLimit(key);
    if (status !== 200) {
      setKeyErrorText(Strings.onboardingSetup.keyInvalidError);
      return;
    }

    setOpenRouterKeyInfo(data);

    realm.write(() => {
      if (!appConf) {
        const newRecord: IAppConfig = {
          userToken: userToken,
          defaultProvider: 'OpenRouter',
          openAI: {
            apiKey: '',
            defaultModel: ''
          },
          openRouter: {
            apiKey: key,
            defaultModel: JSON.stringify(defaultOpenRouterModel)
          },
        }
        realm.create('AppConfig', newRecord);
      } else {
        if (appConf.openRouter) {
          appConf.openRouter.apiKey = key;
          appConf.defaultProvider = 'OpenRouter';
          appConf.openRouter.defaultModel = JSON.stringify(selectedDefaultModel);
        }
      }
    });
  }

  const handleSaveKey = async () => {
    setIsLoading(true);
    if (isEmpty(key)) {
      setKeyErrorText(Strings.onboardingSetup.keyEmptyError);
      return;
    }

    switch (selectedProvider) {
      case 'OpenAI':
        await handleSaveOpenAIKey(key);
        break;
      case 'OpenRouter':
        await handleSaveOpenRouterKey(key);
        break;
      default:
        break;
    }

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

  const providerOptions: Array<ActionItemProps> = [
    {
      label: Strings.setting.openAIProvider,
      color: Colors.text_color,
      onPress: () => {
        setSelectedProvider('OpenAI');
        providerActionSheetRef.current?.hide();
      }
    },
    {
      label: Strings.setting.openRouterProvider,
      color: Colors.text_color,
      onPress: () => {
        setSelectedProvider('OpenRouter');
        providerActionSheetRef.current?.hide();
      }
    }
  ]

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

  const handleSetKeyProps = async () => {
    if (appConf) {
      if (appConf.defaultProvider === 'OpenRouter') {
        try {
          const defaultModel = JSON.parse(appConf?.openRouter.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          console.debug('~ something went wrong when parsing default model')
        } finally {

        }

        const { status, data } = await getKeyLimit(appConf?.openRouter?.apiKey)
        if (status === 200) {
          setOpenRouterKeyInfo(data);
        }
      } else if (appConf.defaultProvider === 'OpenAI') {
        try {
          const defaultModel = JSON.parse(appConf?.openAI.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          console.debug('~ something went wrong when parsing default model')
        } finally {

        }
      }
    }
  }

  useEffect(() => {
    handleSetKeyProps();
  }, [appConf])

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      if (user) {
        setEmail(user.email || '');
      }
    });

    return subscriber;
  }, []);

  const renderOpenAIKeySetup = () => {
    return (
      <>
        <TextEdit
          value={isEditing ? key : maskApiKey(key)}
          label={Strings.onboardingSetup.openAILabelInputKey}
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
      </>)
  };

  const renderOpenRouterKeySetup = () => {
    return (
      <>
        <TextEdit
          value={isEditing ? key : maskApiKey(key)}
          label={Strings.onboardingSetup.openRouterLabelInputKey}
          placeholder={Strings.onboardingSetup.pleasePasteOpenRouterKey}
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

        <View style={{ height: Spacing.L }} />
        {selectedDefaultModel?.id &&
          <View style={styles.row}>
            <Text style={[Typography.body, { fontWeight: '500' }]}>{Strings.setting.defaultModel}</Text>
            <Pressable
              disabled={!isEditing}
              onPress={() => navigation.navigate('ModelSelection', {
                provider: appConf?.defaultProvider,
                callback: (model: TGetModelPropertiesResponse) => setSelectedDefaultModel(model),
                key: appConf?.defaultProvider === 'OpenAI' ? appConf?.openAI?.apiKey : appConf?.openRouter?.apiKey
              })}
              style={(pressed) => [styles.providerBtn, getPressableStyle(pressed)]}
            >
              <Text style={[Typography.description]}>{selectedDefaultModel.id}</Text>
            </Pressable>
          </View>
        }
        <View style={{ height: Spacing.L }} />

        {openRouterKeyInfo && (
          <View style={styles.keyInfo}>
            <LineData label={Strings.setting.keyLabel} value={openRouterKeyInfo?.data?.label} />
            <LineData label={Strings.setting.keyCreditUsed} value={openRouterKeyInfo?.data?.usage} />
            <LineData label={Strings.setting.keyCreditRemaining} value={openRouterKeyInfo?.data?.limit_remaining} />
            <LineData label={Strings.setting.keyCreditLimit} value={openRouterKeyInfo?.data?.limit} />
            <LineData label={Strings.setting.keyRateLimit} value={`${openRouterKeyInfo?.data?.rate_limit?.requests} requests per ${openRouterKeyInfo?.data?.rate_limit?.interval}`} />
            <Pressable style={(pressed) => [styles.addCreditBtn, getPressableStyle(pressed)]}>
              <Text>{Strings.setting.addCreditBtn}</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: Spacing.L }} />
      </>)
  };

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
        <InlineOptionSheet
          title={Strings.setting.language}
          options={languageOptions}
          selectedValue={language}
        />
        <View style={{ height: Spacing.M }} />
        <View>
          <TextEdit
            label={Strings.setting.email}
            value={email}
            onChange={setEmail}
            isEdit={isEditing}
          />

          <View style={styles.row}>
            <Text style={[Typography.body, { fontWeight: '500' }]}>{Strings.setting.providerLabel}</Text>
            <Pressable
              hitSlop={20}
              disabled={!isEditing}
              onPress={() => providerActionSheetRef.current?.show()}
              style={(pressed) => [styles.providerBtn, getPressableStyle(pressed)]}
            >
              <Text style={Typography.description}>{selectedProvider}</Text>
            </Pressable>
          </View>

          <View style={{ height: Spacing.M }} />

          {selectedProvider === 'OpenAI' ? renderOpenAIKeySetup() : renderOpenRouterKeySetup()}

        </View>
        <View style={{ height: Spacing.XL }} />
      </ScrollView >

      {isEditing &&
        <View style={styles.footer}>
          <Button label={Strings.common.cancel} onPress={() => { setIsEditing(false); handleSetKeyProps(); }} style={styles.btnBottom} outline={true} />
          <Button label={Strings.onboardingSetup.saveBtn} onPress={handleSaveKey} style={styles.btnBottom} isLoading={isLoading} />
        </View>}

      <BottomActionSheet
        actionRef={actionSheetRef}
        actions={actionSheet}
      />
      <BottomActionSheet
        actionRef={providerActionSheetRef}
        actions={providerOptions}
      />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    marginTop: Spacing.L,
    gap: Spacing.XL,
    paddingHorizontal: Spacing.horizontalPadding + Spacing.S,
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
  providerBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 8,
    marginLeft: Spacing.S,
    backgroundColor: Colors.powder_blue,
    paddingHorizontal: Spacing.S,
    paddingVertical: Spacing.XS,
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
  keyInfo: {
    gap: Spacing.XS,
    padding: Spacing.M,
    borderRadius: Spacing.M,
    backgroundColor: Colors.ice_blue,
    // ...Layout.shadow,
    // shadowColor: Colors.kiwi_green
  },
  addCreditBtn: {
    width: '100%',
    padding: Spacing.S,
    marginTop: Spacing.XS,
    borderRadius: Spacing.S,
    backgroundColor: Colors.sky_blue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultModel: {
    padding: Spacing.S,
    borderRadius: Spacing.S,
    backgroundColor: Colors.ice_blue
  }
});

export default Settings;