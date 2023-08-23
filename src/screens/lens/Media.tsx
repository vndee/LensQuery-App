import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Routes } from '../../types/navigation';
import { Colors, Spacing, Typography, Layout } from '../../styles';
import { StackScreenProps } from '@react-navigation/stack';
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
  LayoutRectangle,
  Image,
  StatusBar,
  NativeSyntheticEvent,
  ImageLoadEventData
} from 'react-native';
import { getImageSize } from '../../utils/Helper';
import CameraRoll from '@react-native-camera-roll/camera-roll'
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImageEditor from "@react-native-community/image-editor";
import Cropper from 'react-native-image-cropview';
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

const Media = ({ navigation, route }: StackScreenProps<Routes, 'Media'>): JSX.Element => {
  const { path, type } = route.params;
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [hasMediaLoaded, setHasMediaLoaded] = useState(false);
  const isForeground = useIsForeground();
  const isScreenFocused = useIsFocused();
  const [savingState, setSavingState] = useState<'none' | 'saving' | 'saved'>('none');
  const [cropData, setCropData] = useState(null);
  const [isCropMode, setIsCropMode] = useState(false);

  const onMediaLoad = useCallback((event: any | NativeSyntheticEvent<ImageLoadEventData>) => {
    console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
  }, []);

  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
    setHasMediaLoaded(true);
  }, []);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  // const screenStyle = useMemo(() => ({ opacity: hasMediaLoaded ? 1 : 0 }), [hasMediaLoaded]);

  const onCropDone = (layout: LayoutRectangle) => {
    const cropData = {
      offset: { x: layout.x, y: layout.y },
      size: { width: layout.width, height: layout.height },
    };

    ImageEditor.cropImage(source.uri, cropData).then(url => {
      setCroppedImage(url);
    });
  }

  const onCropCancel = () => {
    setCroppedImage(null);
  }

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const renderHeader = useCallback(() => {
    return (
      <View style={styles.row}>
        <TouchableOpacity onPress={() => { navigation.goBack(); }}>
          <Ionicons name='arrow-back-outline' size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={Layout.header}>
        {renderHeader()}
      </View>

      <View style={{ flex: 1 }}>
        {isCropMode ?
          <Cropper
            uri={source.uri}
            onDone={onCropDone}
            onCancel={onCropCancel}
            hideFooter={true}
            scaleMax={5}
            getImageSize={getImageSize}
          /> :
          <Image
            source={source}
            style={{ flex: 1 }}
            resizeMode='contain'
            onLoad={onMediaLoad}
            onLoadEnd={onMediaLoadEnd}
          />}
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bottomBarBtn}
          onPress={() => { }}
        >
          <Ionicons name="save" size={35} color={Colors.primary} style={styles.icon} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.bottomBarBtn}
          onPress={() => setIsCropMode(true)}
        >
          <Ionicons name="crop" size={35} color={Colors.primary} style={styles.icon} />
        </TouchableOpacity>
      </View>
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
  cropButton: {
    position: 'absolute',
    bottom: Spacing.safePaddingBottom,
    right: Spacing.safePaddingRight,
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
  bottomBar: {
    width: '100%',
    height: 64,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  bottomBarBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Media;