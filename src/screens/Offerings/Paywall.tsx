import { Routes } from '../../types/navigation';
import Carousel from 'react-native-reanimated-carousel';
import { StackScreenProps } from '@react-navigation/stack';
import SubcriptionCard from '../../components/Paywall/Card';
import { Colors, Layout, Spacing, Typography } from '../../styles';
import React, { useState, useEffect, useCallback } from 'react';
import SubcriptionPackage from '../../components/Paywall/Package';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';


const LQ_MONTHLY_OFFERINGS = 'lq_monthly_offerings';

const Paywall = ({ navigation, route }: StackScreenProps<Routes, 'Paywall'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);

  const getOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      const offerings = await Purchases.getOfferings();

      if (offerings.current !== null) {
        setPackages(offerings.current.availablePackages.sort((a, b) => a.product.price - b.product.price));
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getOfferings();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Carousel
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
      /> */}
      {packages && packages.length > 0 && (
        <View style={styles.bottomView}>
          {packages.map((item, index) =>
            <SubcriptionCard
              key={index}
              item={item}
              isSelected={selectedPackage?.identifier === item.identifier}
              callback={setSelectedPackage}
            />
          )}
        </View>
      )}
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
  bottomView: {
    gap: Spacing.S,
    width: '100%',
    flexDirection: 'column',
    position: 'absolute',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    bottom: Spacing.safePaddingBottom,
  }
});

export default Paywall;