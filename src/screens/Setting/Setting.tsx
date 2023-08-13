import React, { useState } from 'react';
import { Routes } from '../../types/navigation';
import Button from '../../components/Button';
import auth from '@react-native-firebase/auth';
import Strings from '../../localization';
import { clearStorageKeepAuth } from '../../storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Spacing, Layout, Typography } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';


const Setting = ({ navigation }: NativeStackScreenProps<Routes, 'Setting'>) => {
  const handleLogout = () => {
    console.log('~ handleClearAll');
    clearStorageKeepAuth();
    // dispatch(setLogin(false));
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        <View style={Layout.row}>
          <TouchableOpacity onPress={navigation.goBack} style={styles.backIcon}>
            <Ionicons name="chevron-back" size={20} color={Colors.text_color} />
          </TouchableOpacity>
          <Text style={Typography.H3}>Setting</Text>
        </View>
      </View>
      <View style={Layout.content}>
        <Button label="Logout" onPress={handleLogout} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backIcon: {
    width: 24,
    height: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  row: {
    flex: 1,
    gap: Spacing.XS,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default Setting;