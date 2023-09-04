import Strings from '../../localization';
import { Routes } from '../../types/navigation';
import { FlashList } from '@shopify/flash-list';
import React, { useState, useEffect } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StackScreenProps } from '@react-navigation/stack';
import { getPressableStyle } from '../../styles/Touchable';
import ModelRow from '../../components/Information/ModelRow';
import { getOpenAIModelProperties } from '../../services/openai';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Typography, Layout, Colors, Spacing } from '../../styles';
import { TGetModelPropertiesResponse } from '../../types/openrouter';
import { getOpenRouterModelProperties } from '../../services/openrouter';

const ModelSelection = ({ navigation, route }: StackScreenProps<Routes, 'ModelSelection'>) => {
  const { provider, callback, key } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openRouterModelProperties, setOpenRouterModelProperties] = useState<Array<TGetModelPropertiesResponse> | null>([]);

  const handleGetOpenRouterModelProperties = async () => {
    try {
      setIsLoading(true);
      const { status, data } = await getOpenRouterModelProperties();
      if (status === 200) {
        setOpenRouterModelProperties(data);
      } else {
        console.log('error:', status, data);
      }
    } catch (error) {
      console.debug('[error]:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetOpenAIModelProperties = async (key: string) => {
    try {
      setIsLoading(true);
      const { status, data } = await getOpenAIModelProperties(key);
    } catch (error) {
      console.debug('[error]:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleGetOpenRouterModelProperties();
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <View style={[Layout.header, { paddingHorizontal: Spacing.horizontalPadding, marginTop: 13 }]}>
        <View style={Layout.row}>
          <Pressable onPress={navigation.goBack} style={getPressableStyle} hitSlop={20}>
            <Ionicons name="arrow-back" size={20} color={Colors.white} />
          </Pressable>
          <Text style={[Typography.H3, { marginLeft: Spacing.XS, color: Colors.white }]}>{Strings.modelSelection.title}</Text>
        </View>
      </View>
      {openRouterModelProperties && openRouterModelProperties?.length > 0 && (
        <View style={styles.container}>
          <FlashList
            data={openRouterModelProperties}
            estimatedItemSize={100}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <ModelRow data={item} callback={(item: TGetModelPropertiesResponse) => { callback(item); navigation.goBack(); }} />}
            ItemSeparatorComponent={() => <View style={{ height: Spacing.M }} />}
            ListFooterComponent={() => <View style={{ height: Spacing.safePaddingBottom }} />}
          />
        </View>
      )}
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    ...Layout.content,
    marginTop: Spacing.M,
  }
});

export default ModelSelection;