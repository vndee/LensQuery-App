import { get } from 'lodash'
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
import { maskApiKey, formatTime, unixToDate } from '../../utils/Helper';
import { IAppConfig } from '../../types/chat';
import Purchases from 'react-native-purchases';
import { getKeyLimit } from '../../services/openrouter';
import { checkValidApiKey } from '../../services/openai';
import { useRealm, useObject } from '../../storage/realm';
import { getPressableStyle } from '../../styles/Touchable';
import LineData from '../../components/Information/LineData';
import ProgressCircle from 'react-native-progress/CircleSnail';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { TGetKeyLimitResponse, TGetModelPropertiesResponse } from '../../types/openrouter';
import { View, Text, StyleSheet, ScrollView, Pressable, Platform, KeyboardAvoidingView, Linking, Alert } from 'react-native';
import InlineOptionSheet, { InlineOptionSheetProps } from '../../components/ActionSheet/InlineOptionSheet';
import BottomActionSheet, { ActionItemProps, ActionSheetRef } from '../../components/ActionSheet/BottomSheet';
import { CreditDetails } from '../../types/config';
import { checkFreeTrialStatus, deleteAccount, getSubscriptionDetails } from '../../services/api';
import { OPENAI_KEY_HELP, OPENROUTER_KEY_HELP, subscriptionName } from '../../utils/Constants';

const defaultLensQueryModel: TGetModelPropertiesResponse = {
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
  const { userToken, language, subscriptionPlan, isLogin } = useSelector((state: any) => state.auth);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [keyErrorText, setKeyErrorText] = useState<string>('');
  const actionSheetRef = React.useRef<ActionSheetRef>(null);
  const providerActionSheetRef = React.useRef<ActionSheetRef>(null);
  const appConf = useObject<IAppConfig>('AppConfig', userToken);
  const [email, setEmail] = useState<string>('');
  const [creditDetails, setCreditDetails] = useState<CreditDetails | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>(appConf?.defaultProvider || 'LensQuery');
  const [openRouterKeyInfo, setOpenRouterKeyInfo] = useState<TGetKeyLimitResponse | null>(null);
  const [selectedDefaultModel, setSelectedDefaultModel] = useState<TGetModelPropertiesResponse | null>(null);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        Purchases.logOut();
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        console.log('User signed out!')
      });
  };

  useEffect(() => {
    if (appConf) {
      if (appConf.defaultProvider === 'OpenAI') {
        setKey(appConf?.openAI?.apiKey || '');
      } else if (appConf.defaultProvider === 'OpenRouter') {
        setKey(appConf?.openRouter?.apiKey || '');
      }
    }
    console.log('AppConf:', appConf)
  }, [appConf]);

  useEffect(() => {
    if (appConf) {
      if (selectedProvider === 'OpenAI') {
        setKey(appConf?.openAI?.apiKey || '');
        try {
          const defaultModel = JSON.parse(appConf?.openAI.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          setSelectedDefaultModel(defaultOpenAIModel);
        }
      } else if (selectedProvider === 'OpenRouter') {
        setKey(appConf?.openRouter?.apiKey || '');
        try {
          const defaultModel = JSON.parse(appConf?.openRouter.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          setSelectedDefaultModel(defaultOpenRouterModel);
        }
      } else if (selectedProvider === 'LensQuery') {
        try {
          const defaultModel = JSON.parse(appConf?.openRouter.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          setSelectedDefaultModel(defaultLensQueryModel);
        }
      }
    }
  }, [selectedProvider]);

  const handleReset = () => {
    setIsEditing(false);
    setIsLoading(false);
  }

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
          },
          lensQuery: {
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
          lensQuery: {
            apiKey: '',
            defaultModel: ''
          }
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
  };

  const handleSaveLensQueryConfig = async () => {
    realm.write(() => {
      if (!appConf) {
        const newRecord: IAppConfig = {
          userToken: userToken,
          defaultProvider: 'LensQuery',
          openAI: {
            apiKey: '',
            defaultModel: ''
          },
          openRouter: {
            apiKey: '',
            defaultModel: ''
          },
          lensQuery: {
            apiKey: '',
            defaultModel: JSON.stringify(defaultLensQueryModel)
          }
        }
        realm.create('AppConfig', newRecord);
      } else {
        appConf.defaultProvider = 'LensQuery';
        if (appConf.lensQuery) {
          appConf.lensQuery.defaultModel = JSON.stringify(selectedDefaultModel);
        }
      }
    });
  }

  const handleSaveKey = async () => {
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    if (isEmpty(key)) {
      setKeyErrorText(Strings.onboardingSetup.keyEmptyError);
      setIsLoading(false);
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

    handleReset();
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);

    const resp = await deleteAccount(userToken);
    if (resp === 200) {
      handleLogout();
    } else {
      Alert.alert(
        Strings.common.alertTitle,
        Strings.common.unknownError,
        [
          {
            text: Strings.common.ok,
            onPress: () => { },
          }
        ]
      )
      setIsLoading(false);
    }

    setIsLoading(false);
  };

  const actionSheet: Array<ActionItemProps> = [
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
      label: Strings.setting.termOfUse,
      icon: 'document-text-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        navigation.navigate('Agreement', { type: 'terms' })
      }
    },
    {
      label: Strings.setting.privacyPolicy,
      icon: 'shield-checkmark-outline',
      color: Colors.text_color,
      onPress: () => {
        actionSheetRef.current?.hide();
        navigation.navigate('Agreement', { type: 'privacy' })
      }

    },
    {
      label: Strings.setting.actionLogOut,
      icon: 'log-out-outline',
      color: Colors.danger,
      onPress: () => {
        actionSheetRef.current?.hide();
        handleLogout();
      }
    }
  ];

  const providerOptions: Array<ActionItemProps> = [
    {
      label: Strings.setting.lensQueryProvider,
      color: Colors.text_color,
      onPress: () => {
        if (isLogin) {
          setSelectedProvider('LensQuery');
          handleSaveLensQueryConfig();
          setKeyErrorText('');
          providerActionSheetRef.current?.hide();
        } else {
          providerActionSheetRef.current?.hide();
          Alert.alert(
            Strings.common.alertTitle,
            Strings.common.loginRequired,
            [
              {
                text: Strings.common.cancel,
                onPress: () => { },
                style: 'cancel'
              },
              {
                text: Strings.common.ok,
                onPress: () => navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                }),
                style: 'default'
              }
            ]
          )
        }
      }
    },
    {
      label: Strings.setting.openAIProvider,
      color: Colors.text_color,
      onPress: () => {
        setIsEditing(true);
        setSelectedProvider('OpenAI');
        setKeyErrorText('');
        providerActionSheetRef.current?.hide();
      }
    },
    {
      label: Strings.setting.openRouterProvider,
      color: Colors.text_color,
      onPress: () => {
        setIsEditing(true);
        setSelectedProvider('OpenRouter');
        setKeyErrorText('');
        providerActionSheetRef.current?.hide();
      }
    },
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
      } else if (appConf.defaultProvider === 'LensQuery') {
        try {
          const defaultModel = JSON.parse(appConf?.lensQuery.defaultModel) as TGetModelPropertiesResponse;
          setSelectedDefaultModel(defaultModel);
        } catch (error) {
          console.debug('~ something went wrong when parsing default model')
        } finally {

        }
      }
    } else {
      setSelectedProvider('LensQuery');
      setSelectedDefaultModel(defaultLensQueryModel);
      realm.write(() => {
        const newRecord: IAppConfig = {
          userToken: userToken,
          defaultProvider: 'LensQuery',
          openAI: {
            apiKey: '',
            defaultModel: ''
          },
          openRouter: {
            apiKey: '',
            defaultModel: ''
          },
          lensQuery: {
            apiKey: '',
            defaultModel: JSON.stringify(defaultLensQueryModel)
          }
        }
        realm.create('AppConfig', newRecord);
      })
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      getSubscriptionDetails().then((res) => {
        const { status, data } = res;
        // console.log('Subscription details', data)
        if (status === 200) {
          setCreditDetails(data);
          console.log('Credit details', data)
        }
      }).catch((err) => {
        console.debug('~ err', err)
      });

      // Purchases.getCustomerInfo().then((res) => {
      //   console.debug('~ res', res)
      // }).catch((err) => {
      //   console.debug('~ err', err)
      // });
    });

    return unsubscribe;
  }, [navigation]);

  const renderOpenAIKeySetup = () => {
    return (
      <>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        </KeyboardAvoidingView>
        <View style={{ gap: Spacing.S }}>
          <View style={styles.instruction}>
            <Text style={Typography.description}>{Strings.onboardingSetup.dontKnowHowToGetKey}</Text>
            <Pressable onPress={() => Linking.openURL(OPENAI_KEY_HELP)} style={getPressableStyle} hitSlop={20}>
              <Text style={[Typography.description, { color: Colors.primary, fontWeight: 'bold' }]}> {Strings.common.clickHere}</Text>
            </Pressable>
          </View>
          <Text style={Typography.description}>{Strings.onboardingSetup.disclaimer}</Text>
        </View>
      </>)
  };

  const renderOpenRouterKeySetup = () => {
    return (
      <>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        </KeyboardAvoidingView>
        <View style={{ gap: Spacing.S }}>
          <View style={styles.instruction}>
            <Text style={Typography.description}>{Strings.onboardingSetup.dontKnowHowToGetKey}</Text>
            <Pressable onPress={() => {
              Linking.openURL(OPENROUTER_KEY_HELP)
            }} style={getPressableStyle} hitSlop={20}>
              <Text style={[Typography.description, { color: Colors.primary, fontWeight: 'bold' }]}> {Strings.common.clickHere}</Text>
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
                key: appConf?.defaultProvider === 'OpenAI' ? appConf?.openAI?.apiKey : appConf?.defaultProvider === 'OpenRouter' ? appConf?.openRouter?.apiKey : null
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
            <Pressable
              style={(pressed) => [styles.addCreditBtn, getPressableStyle(pressed)]}
              onPress={() => Linking.openURL('https://openrouter.ai/account')}
            >
              <Text style={[styles.btnLabel, { color: Colors.white }]}>{Strings.setting.addCreditBtn}</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: Spacing.L }} />
      </>)
  };

  const renderLensQuery = () => {
    return (
      <View style={{ gap: Spacing.L }}>
        {selectedDefaultModel?.id &&
          <View style={styles.row}>
            <Text style={[Typography.body, { fontWeight: '500' }]}>{Strings.setting.defaultModel}</Text>
            <Pressable
              onPress={() => navigation.navigate('ModelSelection', {
                provider: appConf?.defaultProvider,
                callback: (model: TGetModelPropertiesResponse) => {
                  setSelectedDefaultModel(model);
                  realm.write(() => {
                    if (appConf?.lensQuery) {
                      appConf.lensQuery.defaultModel = JSON.stringify(model)
                    }
                  })
                },
                key: appConf?.defaultProvider === 'OpenAI' ? appConf?.openAI?.apiKey : appConf?.defaultProvider === 'OpenRouter' ? appConf?.openRouter?.apiKey : null
              })}
              style={(pressed) => [styles.providerBtn, getPressableStyle(pressed)]}
            >
              <Text style={[Typography.description]}>{selectedDefaultModel.id}</Text>
            </Pressable>
          </View>}
        <View style={styles.keyInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text>{Strings.setting.balanceHelper}</Text>
            <Text style={[Typography.title, { fontWeight: '800' }]}> 5 </Text>
            <Text>{Strings.setting.creditRemaining}</Text>
          </View>
          <Pressable
            style={(pressed) => [styles.addCreditBtn, getPressableStyle(pressed)]}
            onPress={() => navigation.navigate('Packages')}
          >
            <Text style={[styles.btnLabel, { color: Colors.off_white }]}>{Strings.setting.addCreditBtn}</Text>
          </Pressable>
        </View>
      </View>
    )
  }

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
          {isLogin && <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <TextEdit
              label={Strings.setting.email}
              value={email}
              onChange={setEmail}
              isEdit={false}
            />
          </KeyboardAvoidingView>}

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
            <Pressable
              hitSlop={20}
              onPress={() => { providerActionSheetRef.current?.show(); }}
              style={(pressed) => [{ marginLeft: Spacing.XXS }, getPressableStyle(pressed)]}
            >
              <Ionicons name="settings-outline" size={20} color={Colors.primary} />
            </Pressable>
          </View>

          <View style={{ height: Spacing.M }} />

          {selectedProvider === 'OpenAI' ? renderOpenAIKeySetup() : selectedProvider === 'OpenRouter' ? renderOpenRouterKeySetup() : renderLensQuery()}

        </View>
        <View style={{ height: Spacing.XL }} />

        {isLogin && <View style={styles.dangerZone}>
          <Text style={[Typography.body, { fontWeight: '500' }]}>{Strings.setting.dangerZone}</Text>
          <Text style={[Typography.description, { fontWeight: '300' }]}>{Strings.setting.dangerZoneDesc}</Text>
          <Pressable
            style={(pressed) => [styles.dangerBtn, getPressableStyle(pressed)]}
            onPress={() => {
              Alert.alert(
                Strings.common.alertTitle,
                Strings.setting.deleteAccountConfirm,
                [
                  {
                    text: Strings.common.cancel,
                    onPress: () => { },
                    style: 'cancel'
                  },
                  {
                    text: Strings.common.ok,
                    onPress: () => { handleDeleteAccount() },
                    style: 'destructive'
                  }
                ]
              )
            }}
          >
            <Text style={[styles.btnLabel, { color: Colors.white }]}>{Strings.setting.actionDeleteAccuont}</Text>
          </Pressable>
        </View>}
        <View style={{ height: Spacing.XL }} />

      </ScrollView >

      {
        isEditing && selectedProvider !== 'LensQuery' &&
        <View style={styles.footer}>
          <Pressable
            style={(pressed) => [styles.btnBottomOutline, getPressableStyle(pressed)]}
            onPress={() => { setIsEditing(false); handleSetKeyProps(); }}
          >
            <Text style={[styles.btnLabel, { color: Colors.primary }]}>{Strings.common.cancel}</Text>
          </Pressable>
          <Pressable
            style={(pressed) => [styles.btnBottom, getPressableStyle(pressed)]}
            onPress={handleSaveKey}
          >
            <Text style={styles.btnLabel}>{Strings.onboardingSetup.saveBtn}</Text>
            {
              isLoading &&
              <View style={{ marginLeft: Spacing.S }}>
                <ProgressCircle size={20} color={Colors.white} thickness={2} />
              </View>
            }
          </Pressable>
        </View>
      }

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
    width: '100%',
    gap: Spacing.M,
    alignSelf: 'center',
    flexDirection: 'row',
    paddingTop: Spacing.M,
    marginBottom: Spacing.M,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontalPadding,
    paddingBottom: Spacing.SAFE_BOTTOM
  },
  btnBottom: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.btnColor,
    borderRadius: Spacing.M,
    paddingVertical: Spacing.buttonVerticalPadding,
    paddingHorizontal: Spacing.L,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  btnBottomOutline: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    backgroundColor: Colors.white,
    borderRadius: Spacing.M,
    paddingVertical: Spacing.buttonVerticalPadding,
    paddingHorizontal: Spacing.L,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnLabel: {
    ...Typography.title,
    color: Colors.white_two,
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
  },
  dangerZone: {
    width: '100%',
    gap: Spacing.XS,
    padding: Spacing.S,
    borderRadius: Spacing.S,
    backgroundColor: Colors.light_pink_two,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  dangerBtn: {
    width: '100%',
    padding: Spacing.S,
    marginTop: Spacing.XS,
    borderRadius: Spacing.S,
    backgroundColor: Colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Settings;