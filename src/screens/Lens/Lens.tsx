import { Spacing, Colors } from '../../styles';
import {
  Camera,
  CameraDeviceFormat,
  CameraRuntimeError,
  PhotoFile,
  sortFormats,
  useCameraDevices,
  VideoFile,
} from 'react-native-vision-camera';
import Button from '../../components/Button';
import { Routes } from '../../types/navigation';
import { MediaType } from 'react-native-image-picker';
import { useIsFocused } from '@react-navigation/core';
import * as ImagePicker from 'react-native-image-picker';
import { StackScreenProps } from '@react-navigation/stack';
import { getPressableStyle } from '../../styles/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsForeground } from '../../hooks/useIsForeground';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { CaptureButton } from '../../components/Button/CaptureButton';
import { View, StyleSheet, Linking, Pressable, Text } from 'react-native';
import { GestureDetector, Gesture, GestureStateChangeEvent, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { LENS_MAX_ZOOM_FACTOR, LENS_SCALE_FULL_ZOOM } from '../../utils/Constants';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PinchGestureHandler, PinchGestureHandlerGestureEvent, TapGestureHandler } from 'react-native-gesture-handler';
import Reanimated, { Extrapolate, interpolate, useAnimatedGestureHandler, useAnimatedProps, useSharedValue } from 'react-native-reanimated';
import { isEmpty } from 'lodash';

const ReanimatedCamera = Reanimated.createAnimatedComponent(Camera);
Reanimated.addWhitelistedNativeProps({
  zoom: true,
});

const Lens = ({ navigation, route }: StackScreenProps<Routes, 'Lens'>): JSX.Element => {
  const zoom = useSharedValue(0);
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const isPressingButton = useSharedValue(false);

  // check if camera page is active
  const isFocussed = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocussed && isForeground;

  const [cameraPosition, setCameraPosition] = useState<'front' | 'back'>('back');
  const [enableHdr, setEnableHdr] = useState(false);
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [enableNightMode, setEnableNightMode] = useState(false);

  // camera format settings
  const devices = useCameraDevices();
  const device = devices[cameraPosition];

  const requestCameraPermission = useCallback(async () => {
    console.log('Requesting camera permission...');
    const permission = await Camera.requestCameraPermission();
    console.log(`Camera permission status: ${permission}`);

    if (permission !== 'granted') await Linking.openSettings()
    else {
      console.log('Camera permission granted!');
      setCameraPosition(() => cameraPosition);
    }
  }, []);

  const formats = useMemo<CameraDeviceFormat[]>(() => {
    if (device?.formats == null) return [];
    return device.formats.sort(sortFormats);
  }, [device?.formats]);

  const supportFocus = useMemo<boolean>(() => {
    if (device == null) return false;
    return device.supportsFocus;
  }, [device?.supportsFocus]);

  //#region Memos
  const [is60Fps, setIs60Fps] = useState(true);
  const fps = useMemo(() => {
    if (!is60Fps) return 30;

    if (enableNightMode && !device?.supportsLowLightBoost) {
      // User has enabled Night Mode, but Night Mode is not natively supported, so we simulate it by lowering the frame rate.
      return 30;
    }

    const supportsHdrAt60Fps = formats.some((f) => f.supportsVideoHDR && f.maxFps >= 60);
    if (enableHdr && !supportsHdrAt60Fps) {
      // User has enabled HDR, but HDR is not supported at 60 FPS.
      return 30;
    }

    const supports60Fps = formats.some((f) => f.maxFps >= 60);
    if (!supports60Fps) {
      // 60 FPS is not supported by any format.
      return 30;
    }
    // If nothing blocks us from using it, we default to 60 FPS.
    return 60;
  }, [device?.supportsLowLightBoost, enableHdr, enableNightMode, formats, is60Fps]);

  const supportsCameraFlipping = useMemo(() => devices.back != null && devices.front != null, [devices.back, devices.front]);
  const supportsFlash = device?.hasFlash ?? false;
  const supportsHdr = useMemo(() => formats.some((f) => f.supportsVideoHDR || f.supportsPhotoHDR), [formats]);
  // const supports60Fps = useMemo(() => formats.some((f) => f.frameRateRanges.some((rate) => frameRateIncluded(rate, 60))), [formats]);
  const canToggleNightMode = enableNightMode
    ? true // it's enabled so you have to be able to turn it off again
    : (device?.supportsLowLightBoost ?? false) || fps > 30; // either we have native support, or we can lower the FPS
  //#endregion

  const format = useMemo(() => {
    let result = formats;
    if (enableHdr) {
      // We only filter by HDR capable formats if HDR is set to true.
      // Otherwise we ignore the `supportsVideoHDR` property and accept formats which support HDR `true` or `false`
      result = result.filter((f) => f.supportsVideoHDR || f.supportsPhotoHDR);
    }

    // find the first format that includes the given FPS
    return result.find((f) => f.maxFps >= fps);
  }, [formats, fps, enableHdr]);

  //#region Animated Zoom
  // This just maps the zoom factor to a percentage value.
  // so e.g. for [min, neutr., max] values [1, 2, 128] this would result in [0, 0.0081, 1]
  const minZoom = device?.minZoom ?? 1;
  const maxZoom = Math.min(device?.maxZoom ?? 1, LENS_MAX_ZOOM_FACTOR);

  const cameraAnimatedProps = useAnimatedProps(() => {
    const z = Math.max(Math.min(zoom.value, maxZoom), minZoom);
    return {
      zoom: z,
    };
  }, [maxZoom, minZoom, zoom]);
  //#endregion

  //#region Callbacks
  const setIsPressingButton = useCallback(
    (_isPressingButton: boolean) => {
      isPressingButton.value = _isPressingButton;
    },
    [isPressingButton],
  );
  // Camera callbacks
  const onError = useCallback((error: CameraRuntimeError) => {
    console.error(error);
  }, []);
  const onInitialized = useCallback(() => {
    console.log('Camera initialized!');
    setIsCameraInitialized(true);
  }, []);
  const onMediaCaptured = useCallback(
    (media: PhotoFile | VideoFile, type: 'photo' | 'video') => {
      console.log(`Media captured! ${JSON.stringify(media)}`);
      navigation.navigate('Media', {
        path: media.path,
        type: type,
      });
    },
    [navigation],
  );
  const onFlipCameraPressed = useCallback(() => {
    setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
  }, []);
  const onFlashPressed = useCallback(() => {
    setFlash((f) => (f === 'off' ? 'on' : 'off'));
  }, []);
  //#endregion

  //#region Tap Gesture
  const onDoubleTap = useCallback(() => {
    onFlipCameraPressed();
  }, [onFlipCameraPressed]);
  //#endregion

  //#region Effects
  const neutralZoom = device?.neutralZoom ?? 1;
  useEffect(() => {
    // Run everytime the neutralZoomScaled value changes. (reset zoom when device changes)
    zoom.value = neutralZoom;
  }, [neutralZoom, zoom]);

  //#region Pinch to Zoom Gesture
  // The gesture handler maps the linear pinch gesture (0 - 1) to an exponential curve since a camera's zoom
  // function does not appear linear to the user. (aka zoom 0.1 -> 0.2 does not look equal in difference as 0.8 -> 0.9)
  const onPinchGesture = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent, { startZoom?: number }>({
    onStart: (_, context) => {
      context.startZoom = zoom.value;
    },
    onActive: (event, context) => {
      // we're trying to map the scale gesture to a linear zoom here
      const startZoom = context.startZoom ?? 0;
      const scale = interpolate(event.scale, [1 - 1 / LENS_SCALE_FULL_ZOOM, 1, LENS_SCALE_FULL_ZOOM], [-1, 0, 1], Extrapolate.CLAMP);
      zoom.value = interpolate(scale, [-1, 0, 1], [minZoom, startZoom, maxZoom], Extrapolate.CLAMP);
    },
  });
  //#endregion

  if (device != null && format != null) {
    console.log(
      `Re-rendering camera page with ${isActive ? 'active' : 'inactive'} camera. ` +
      `Device: "${device.name}" (${format.photoWidth}x${format.photoHeight} @ ${fps}fps)`,
    );
  } else {
    console.log('re-rendering camera page without active camera');
  }

  const selectImage = async () => {
    const options: {
      selectionLimit: number;
      mediaType: MediaType;
      includeBase64: boolean;
    } = {
      selectionLimit: 0,
      mediaType: 'photo',
      includeBase64: false,
    };

    const onSelect = (selected: any) => {
      if (selected.didCancel) {
        console.log('User cancelled image picker');
        return;
      }
      navigation.navigate('Media', {
        path: selected?.assets?.[0]?.uri,
        type: 'photo',
      });
    };

    await ImagePicker.launchImageLibrary(options, onSelect);
  };

  const singleTap = Gesture.Tap().maxDuration(250).onEnd((tapEvent: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
    // console.log("Single tap detected!", tapEvent);
    // if (!camera || !supportFocus || !camera.current) return;
    // camera.current.focus({ x: tapEvent.x, y: tapEvent.y });
  });

  const doubleTap = Gesture.Tap().maxDuration(250).numberOfTaps(2).onStart(onDoubleTap);

  useEffect(() => {
    requestCameraPermission();
  }, [])

  if (device != null) return (
    <View style={styles.container}>
      <PinchGestureHandler onGestureEvent={onPinchGesture} enabled={isActive}>
        <Reanimated.View style={StyleSheet.absoluteFill}>
          <GestureDetector gesture={Gesture.Exclusive(doubleTap)}>
            <ReanimatedCamera
              ref={camera}
              style={StyleSheet.absoluteFill}
              device={device}
              hdr={enableHdr}
              lowLightBoost={device.supportsLowLightBoost && enableNightMode}
              isActive={isActive}
              onInitialized={onInitialized}
              onError={onError}
              enableZoomGesture={true}
              animatedProps={cameraAnimatedProps}
              photo={true}
              orientation="portrait"
            />
          </GestureDetector>
        </Reanimated.View>
      </PinchGestureHandler>

      <CaptureButton
        style={styles.captureButton}
        camera={camera}
        onMediaCaptured={onMediaCaptured}
        cameraZoom={zoom}
        minZoom={minZoom}
        maxZoom={maxZoom}
        flash={supportsFlash ? flash : 'off'}
        enabled={isCameraInitialized && isActive}
        setIsPressingButton={setIsPressingButton}
      />

      <View style={styles.rightButtonRow}>
        {supportsCameraFlipping && (
          <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={onFlipCameraPressed}>
            <Ionicons name="camera-reverse" color="white" size={24} />
          </Pressable>
        )}
        {supportsFlash && (
          <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={onFlashPressed}>
            <Ionicons name={flash === 'on' ? 'flash' : 'flash-off'} color="white" size={24} />
          </Pressable>
        )}
        {supportsHdr && (
          <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={() => setEnableHdr((h) => !h)}>
            <MaterialIcon name={enableHdr ? 'hdr' : 'hdr-off'} color="white" size={24} />
          </Pressable>
        )}
        {canToggleNightMode && (
          <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={() => setEnableNightMode(!enableNightMode)}>
            <Ionicons name={enableNightMode ? 'moon' : 'moon-outline'} color="white" size={24} />
          </Pressable>
        )}
        <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={selectImage}>
          <MaterialCommunityIcon name="file-image-plus-outline" color="white" size={24} />
        </Pressable>
        <Pressable style={(pressed) => [styles.button, getPressableStyle(pressed)]} hitSlop={20} onPress={() => navigation.navigate('ChatList')}>
          <Ionicons name="chatbubbles-outline" color="white" size={24} />
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: Colors.background,
      gap: Spacing.XL
    }}>
      <Button label="Chat" onPress={() => navigation.navigate('ChatList')} />
      <Button label="Select Image" onPress={selectImage} />
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  captureButton: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: Spacing.safePaddingBottom,
  },
  button: {
    marginBottom: Spacing.L,
    width: 44,
    height: 44,
    borderRadius: 44 / 2,
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonRow: {
    position: 'absolute',
    right: Spacing.safePaddingRight,
    top: Spacing.safePaddingTop,
  },
  text: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  selectImageBtn: {
    position: 'absolute',
    bottom: Spacing.L + 18,
    justifyContent: 'center',
    alignItems: 'center',
    right: Spacing.safePaddingLeft,
    padding: Spacing.M,
    borderRadius: 10,
    zIndex: 1
  }
});

export default Lens;
