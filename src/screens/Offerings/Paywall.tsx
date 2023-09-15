import Button from '../../components/Button';
import { SvgXml } from 'react-native-svg';
import { Routes } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import SubcriptionCard from '../../components/Paywall/Card';
import { Colors, Spacing, Typography } from '../../styles';
import React, { useState, useEffect, useCallback } from 'react';
import Purchases, { PurchasesPackage } from 'react-native-purchases';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { ISubscriptionConfig } from '../../types/config';
import SubscriptionInfo from '../../components/Paywall/Info';
import { getPressableStyle } from '../../styles/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OuterSpaceXML } from '../../components/Illustrations/OuterSpace';


const Paywall = ({ navigation, route }: StackScreenProps<Routes, 'Paywall'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [offeringsMetadata, setOfferingsMetadata] = useState<{ [key: string]: ISubscriptionConfig } | null>(null);

  const getOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      const offerings = await Purchases.getOfferings();
      if (offerings.current !== null) {
        setPackages(offerings.current.availablePackages.sort((a, b) => a.product.price - b.product.price));
        setOfferingsMetadata(offerings.current.metadata as { [key: string]: ISubscriptionConfig });
        setSelectedPackage(offerings.current.availablePackages[1]);
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
    if (offeringsMetadata !== null) {
      console.log('Offerings Metadata:', offeringsMetadata);
    }
  }, [offeringsMetadata]);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  useEffect(() => {
    getOfferings();
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={10}
        onPress={handleGoBack}
        style={(pressed) => [getPressableStyle(pressed), styles.closeBtn]}
      >
        <Ionicons name={"close"} size={26} color={Colors.black_two} />
      </Pressable>
      <SvgXml xml={OuterSpaceXML} width={'100%'} height={'30%'} />
      {selectedPackage && offeringsMetadata && (
        <SubscriptionInfo item={offeringsMetadata[selectedPackage.identifier]} />
      )}

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
      <View style={{ paddingHorizontal: Spacing.L, width: '100%' }}>
        <Button
          label={"Subscribe"}
          onPress={() => { }}
          style={styles.purchaseBtn}
        />
      </View>
    </View>
  );
};

const styles: StyleSheet.NamedStyles<any> = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 0,
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor: Colors.ice_blue,
    paddingTop: Spacing.safePaddingTop,
    paddingBottom: Spacing.safePaddingBottom,
  },
  bottomView: {
    flex: 1,
    gap: Spacing.S,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    paddingBottom: Spacing.safePaddingBottom,
  },
  carousel: {
    marginTop: Spacing.safePaddingTop
  },
  purchaseBtn: {
    width: '100%',
    borderRadius: 16,
  },
  closeBtn: {
    position: 'absolute',
    top: Spacing.safePaddingTop,
    right: Spacing.horizontalPadding,
    width: 44,
    height: 44,
  }
});

export default Paywall;