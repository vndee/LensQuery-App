import React, { useState } from 'react';
import { Routes } from '../../types/navigation';
import { Colors, Spacing } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
import { View, Text, StyleSheet } from 'react-native';


const Agreement = ({ navigation, route }: StackScreenProps<Routes, 'Agreement'>): JSX.Element => {
  const { type } = route.params;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      <Text>{type}</Text>
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