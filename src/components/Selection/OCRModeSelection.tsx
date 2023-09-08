import React, { useEffect, useState } from 'react';
import { getPressableStyle } from '../../styles/Touchable';
import { Colors, Spacing, Typography } from '../../styles'
import { Label, OCRLabels } from '../../types/navigation';
import { Text, View, Pressable, StyleSheet } from 'react-native';

type Props = {
  label: Label;
  callback: (label: Label) => void;
};

const OCRModeSelection = ({ label, callback }: Props) => {
  const [isExpand, setIsExpand] = useState(false);
  const [selectionOptions, setSelectionOptions] = useState<Label[]>(OCRLabels);

  useEffect(() => {
    setSelectionOptions(OCRLabels.filter((item) => item.id !== label.id).sort());
  }, [label]);

  return (
    <View style={styles.bottomBarBtnRight}>
      {isExpand && (
        <>
          <Pressable onPress={() => { setIsExpand(false); callback(selectionOptions[0]); }} style={(pressed) => [styles.buttonLeft, getPressableStyle(pressed)]} hitSlop={20}>
            <Text style={[Typography.description, styles.buttonLeftText]}>{selectionOptions[0].label}</Text>
          </Pressable>
          <Pressable onPress={() => { setIsExpand(false); callback(selectionOptions[1]); }} style={(pressed) => [styles.buttonLeft, getPressableStyle(pressed)]} hitSlop={20}>
            <Text style={[Typography.description, styles.buttonLeftText]}>{selectionOptions[1].label}</Text>
          </Pressable>
        </>
      )}
      <Pressable onPress={() => setIsExpand(!isExpand)} style={(pressed) => [styles.buttonLeft, getPressableStyle(pressed)]} hitSlop={20}>
        <Text style={[Typography.description, styles.buttonLeftText]}>{label.label}</Text>
      </Pressable>
    </View>
  )
};

const styles: StyleSheet.NamedStyles<any> = {
  bottomBarBtnRight: {
    right: 20,
    width: 80,
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'column',
    bottom: Spacing.SAFE_BOTTOM + Spacing.L,
  },
  buttonLeft: {
    padding: Spacing.S,
    marginBottom: Spacing.S,
    borderRadius: Spacing.S,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(140, 140, 140, 0.3)',
  },
  buttonLeftText: {
    color: Colors.white,
    fontWeight: 'bold',
  }
};

export default OCRModeSelection;