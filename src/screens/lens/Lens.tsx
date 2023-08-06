import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import { Camera, useCameraDevices } from 'react-native-vision-camera';

import Storage from '../../storage';
import Button from '../../components/Button';
import { setLogin } from '../../redux/slice/auth';
import { clearStorageKeepAuth } from '../../storage';
import { Colors, Spacing, Typography, Layout } from '../../styles';

const Lens = (): JSX.Element => {
  const dispatch = useDispatch();
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  const handleLogout = () => {
    console.log('~ handleClearAll');
    clearStorageKeepAuth();
    dispatch(setLogin(false));
  };

  if (!device) return (
    <View style={styles.container}>
      <Button label="Logout" onPress={handleLogout} />
    </View>
  );

  return (
    <Camera
      ref={cameraRef}
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    ...Layout.content,
    backgroundColor: Colors.background,
    justifyContent: 'center',
  },
});

export default Lens;
