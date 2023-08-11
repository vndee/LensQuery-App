import React, { useState, useEffect } from 'react';
import { Colors, Spacing, Typography } from '../../styles';
import Animated, { useSharedValue, withSpring, withTiming, useAnimatedStyle, withDecay } from 'react-native-reanimated';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Image, ScrollView, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';

type Item = {
  id: string;
  name: string;
};

type Props = {
  data: Item[],
  value: Item,
  onChange: (item: Item) => void,
  bgActiveColor?: string,
  bgInActiveColor?: string,
  labelActiveColor?: string,
  labelInActiveColor?: string,
};

const LabelSwitch = ({
  data,
  value,
  onChange,
  bgActiveColor = '#fff',
  bgInActiveColor = '#000',
  labelActiveColor = '#000',
  labelInActiveColor = '#fff' }: Props) => {

  const onPress = () => {
    onChange(value.id === data[0].id ? data[1] : data[0]);
  };

  const bgStyle = (item: Item) => useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(value.id === item.id ? bgActiveColor : 'transparent'),
    };
  });

  const textStyle = (item: Item) => useAnimatedStyle(() => {
    return {
      color: withTiming(value.id === item.id ? labelActiveColor : labelInActiveColor),
    };
  });

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View style={[styles.container, { backgroundColor: bgInActiveColor }]}>
        {data.map((item, index) => (
          <Animated.View key={index.toString()} style={[styles.switch, bgStyle(item)]}>
            <Animated.Text style={[Typography.body, textStyle(item)]}>{item.name}</Animated.Text>
          </Animated.View>
        ))}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: Spacing.XS,
    height: 28,
    borderRadius: Spacing.S,
    justifyContent: 'space-between',
    padding: Spacing.XXS,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch: {
    height: '100%',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.XS,
  },
});

export default LabelSwitch;