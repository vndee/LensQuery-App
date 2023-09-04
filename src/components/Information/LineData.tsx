import React, { useState } from 'react';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';

const LineData = ({ label, value }: { label: any, value: any }): JSX.Element => {
  return (
    <View style={styles.row}>
      <Text style={[Typography.body, { fontWeight: '500' }]}>{label}:</Text>
      <Text style={[Typography.body, { marginLeft: Spacing.S }]}>{value}</Text>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  row: {
    flexDirection: 'row'
  }
});

export default LineData;