import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Routes } from '../../types/navigation';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useIsFocused } from '@react-navigation/native';
import { useIsForeground } from '../../hooks/useIsForeground';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
  Image,
  StatusBar,
  NativeSyntheticEvent,
  ImageLoadEventData
} from 'react-native';
import CameraRoll from '@react-native-camera-roll/camera-roll'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StatusBarBlurBackground } from '../../components/StatusBar/StatusBarBlurBackgound';

const requestSavePermission = async (): Promise<boolean> => {
  if (Platform.OS !== 'android') return true;

  const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  if (permission == null) return false;
  let hasPermission = await PermissionsAndroid.check(permission);
  if (!hasPermission) {
    const permissionRequestResult = await PermissionsAndroid.request(permission);
    hasPermission = permissionRequestResult === 'granted';
  }
  return hasPermission;
};

const Media = ({ navigation, route }: NativeStackScreenProps<Routes, 'Media'>): JSX.Element => {
  const { path, type } = route.params;
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none');

  const onMediaLoad = useCallback((event: any | NativeSyntheticEvent<ImageLoadEventData>) => {
    console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
  }, []);

  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded]);

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  return (
    <View style={[styles.container, screenStyle]}>
      <StatusBar hidden backgroundColor={'transparent'} />

      {type === 'photo' && (
        <Image source={source} style={StyleSheet.absoluteFill} resizeMode="cover" onLoadEnd={onMediaLoadEnd} onLoad={onMediaLoad} />
      )}

      <TouchableOpacity style={styles.closeButton} onPress={navigation.goBack}>
        <Ionicons name="close" size={35} color="white" style={styles.icon} />
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.saveButton} onPress={onSavePressed} disabled={savingState !== 'none'}>
        {savingState === 'none' && <Ionicons name="download" size={35} color="white" style={styles.icon} />}
        {savingState === 'saved' && <Ionicons name="checkmark" size={35} color="white" style={styles.icon} />}
        {savingState === 'saving' && <ActivityIndicator color="white" />}
      </TouchableOpacity> */}

      <StatusBarBlurBackground />
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.safePaddingTop,
    left: Spacing.safePaddingLeft,
    width: 44,
    height: 44,
  },
  saveButton: {
    position: 'absolute',
    bottom: Spacing.safePaddingBottom,
    left: Spacing.safePaddingLeft,
    width: 40,
    height: 40,
  },
  icon: {
    textShadowColor: 'black',
    textShadowOffset: {
      height: 0,
      width: 0,
    },
    textShadowRadius: 1,
  },
});

export default Media;