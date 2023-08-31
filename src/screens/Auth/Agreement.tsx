import React, { useState } from 'react';
import Strings from '../../localization';
import Header from '../../components/Header';
import { Routes } from '../../types/navigation';
import { Colors, Spacing } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';


const Agreement = ({ navigation, route }: StackScreenProps<Routes, 'Agreement'>): JSX.Element => {
  const { type } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <Header title={type === 'terms' ? Strings.common.terms : Strings.common.privacy} />

      <View style={styles.container}>
        <Text>{type}</Text>
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
    paddingVertical: Spacing.verticalPadding,
  },
});

export default Agreement;