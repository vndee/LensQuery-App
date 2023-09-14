import { Routes } from '../../types/navigation';
import Carousel from 'react-native-reanimated-carousel';
import { StackScreenProps } from '@react-navigation/stack';
import { Colors, Layout, Spacing, Typography } from '../../styles';
import React, { useState, useEffect, useCallback } from 'react';
import SubcriptionPackage from '../../components/Paywall/Package';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';


const LQ_MONTHLY_OFFERINGS = 'lq_monthly_offerings';

const Paywall = ({ navigation, route }: StackScreenProps<Routes, 'Paywall'>): JSX.Element => {
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);

  const getOfferings = useCallback(async () => {
    try {
      const offerings = await Purchases.getOfferings();
      setPackages(offerings.all[LQ_MONTHLY_OFFERINGS].availablePackages);
      console.log(JSON.stringify(offerings.all[LQ_MONTHLY_OFFERINGS].availablePackages));
    } catch (e) {
      console.log(e);
    }
  }, []);

  useEffect(() => {
    getOfferings();
  }, []);

  return (
    <View style={styles.container}>
      <Carousel
        loop
        autoPlay={false}
        autoPlayInterval={3000}
        style={styles.carousel}
        pagingEnabled={true}
        data={packages}
        renderItem={({ item }) => <SubcriptionPackage item={item} />}
        scrollAnimationDuration={1000}
        height={Spacing.SCREEN_HEIGHT * 0.6}
        width={Spacing.SCREEN_WIDTH}
        onSnapToItem={index => { }}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    paddingTop: Spacing.safePaddingTop,
    paddingBottom: Spacing.safePaddingBottom,
  },
  carousel: {
  }
});

export default Paywall;