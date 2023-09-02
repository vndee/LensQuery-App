import Strings from '../../localization';
import Header from '../../components/Header';
import { Colors, Spacing } from '../../styles';
import { Routes } from '../../types/navigation';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { View, StyleSheet, ScrollView } from 'react-native';
import { getTermsOfUse, getPrivacyPolicy } from '../../services/api';

const Agreement = ({ navigation, route }: StackScreenProps<Routes, 'Agreement'>): JSX.Element => {
  const { type } = route.params;
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [source, setSource] = useState<{ html: string }>({ html: '' });

  const handleFetchSource = async () => {
    setIsLoading(true);
    try {
      const response = await (type === 'terms' ? getTermsOfUse() : getPrivacyPolicy());
      setSource({ html: response });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleFetchSource();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title={type === 'terms' ? Strings.common.terms : Strings.common.privacy} />
      <View style={styles.container}>
        <ScrollView>
          {source && (
            <RenderHtml
              tagsStyles={tagsStyles}
              contentWidth={width}
              source={source}
            />
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.horizontalPadding,
  },
});

const tagsStyles = {
  body: {
    paddingBottom: Spacing.XL + Spacing.M,
  },
};

export default Agreement;