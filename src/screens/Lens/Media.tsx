import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Colors, Spacing } from '../../styles';
import { Routes } from '../../types/navigation';
import {
  View,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
  LayoutRectangle,
  NativeSyntheticEvent,
  ImageLoadEventData
} from 'react-native';
import Cropper from 'react-native-image-cropview';
import { getImageSize } from '../../utils/Helper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPressableStyle } from '../../styles/Touchable';
import { StackScreenProps } from '@react-navigation/stack';
import ImageEditor from "@react-native-community/image-editor";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Media = ({ navigation, route }: StackScreenProps<Routes, 'Media'>): JSX.Element => {
  const { path } = route.params;
  const cropperRef = useRef(null);
  const [isCropMode, setIsCropMode] = useState(false);

  const onMediaLoad = useCallback((event: any | NativeSyntheticEvent<ImageLoadEventData>) => {
    console.log(`Image loaded. Size: ${event.nativeEvent.source.width}x${event.nativeEvent.source.height}`);
  }, []);

  const onMediaLoadEnd = useCallback(() => {
    console.log('media has loaded.');
  }, []);

  const source = useMemo(() => ({ uri: `file://${path}` }), [path]);

  const onCropDone = (layout: LayoutRectangle) => {
    const cropData = {
      offset: { x: layout.x, y: layout.y },
      size: { width: layout.width, height: layout.height },
    };

    ImageEditor.cropImage(source.uri, cropData).then(url => {
      navigation.navigate('ChatBox', { chatBoxId: undefined, imageUri: url });
    });
  }

  const onCropCancel = () => {
    console.log('user cancel crop');
    // @ts-ignore
    cropperRef?.current?.cancel();
  }

  useEffect(() => {
    StatusBar.setHidden(true);
  }, []);

  const handleCropData = () => {
    // @ts-ignore
    cropperRef?.current?.done();
  }

  const handleGoBack = () => {
    if (navigation.canGoBack()) navigation.goBack();
  }

  const renderFooterDefaultMode = useCallback(() => {
    return (
      <View style={styles.bottomBarBtn}>
        <Pressable onPress={handleGoBack} style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20}>
          <Ionicons name="close" size={26} color={Colors.white} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => setIsCropMode(true)} style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20}>
          <MaterialCommunityIcons name="crop-free" size={26} color={Colors.white} style={styles.icon} />
        </Pressable>
        <Pressable onPress={() => navigation.navigate('ChatBox', { chatBoxId: undefined, imageUri: source.uri })} style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20}>
          <Ionicons name="checkmark-outline" size={26} color={Colors.white} style={styles.icon} />
        </Pressable>
      </View>
    );
  }, []);

  const renderFooterCropMode = useCallback(() => {
    return (
      <View style={styles.bottomBarBtn}>
        <Pressable onPress={() => setIsCropMode(false)} style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20}>
          <MaterialCommunityIcons name="close" size={26} color={Colors.white} style={styles.icon} />
        </Pressable>
        <Pressable onPress={handleCropData} style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20}>
          <Ionicons name="checkmark-outline" size={26} color={Colors.white} style={styles.icon} />
        </Pressable>
      </View>
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={[{ flex: 1 }, isCropMode && { marginTop: Spacing.safePaddingTop, marginBottom: 100 }]}>
        {isCropMode ?
          <Cropper
            ref={cropperRef}
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
      {isCropMode ? renderFooterCropMode() : renderFooterDefaultMode()}
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
    gap: Spacing.S,
    width: '100%',
    // height: 64,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: Spacing.M,
    paddingBottom: Spacing.SAFE_BOTTOM
  },
  bottomBarBtn: {
    gap: Spacing.L,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    bottom: Spacing.SAFE_BOTTOM,
  },
  button: {
    marginBottom: Spacing.L,
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default Media;