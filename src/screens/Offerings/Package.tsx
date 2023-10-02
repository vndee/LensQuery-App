import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../components/Button';
import { SvgXml } from 'react-native-svg';
import Strings from '../../localization';
import Toast from 'react-native-simple-toast';
import { Routes } from '../../types/navigation';
import { StackScreenProps } from '@react-navigation/stack';
import SubcriptionCard from '../../components/Paywall/Card';
import { Colors, Spacing, Typography } from '../../styles';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { ISubscriptionConfig, IPackageConfig } from '../../types/config';
import SubscriptionInfo from '../../components/Paywall/Info';
import ConsumableProduct from '../../components/Paywall/Product';
import { getPressableStyle } from '../../styles/Touchable';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { OuterSpaceXML } from '../../components/Illustrations/OuterSpace';
import Purchases, { PurchasesPackage, PurchasesError } from 'react-native-purchases';
import { formatNumber } from '../../utils/Helper';


const Packages = ({ navigation, route }: StackScreenProps<Routes, 'Packages'>): JSX.Element => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [offeringsMetadata, setOfferingsMetadata] = useState<IPackageConfig | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);

  useEffect(() => {
    if (selectedPackage?.identifier && offeringsMetadata?.amount) {
      // @ts-ignore
      setSelectedAmount(offeringsMetadata?.amount[selectedPackage?.identifier] || 0);
    }
  }, [selectedPackage, offeringsMetadata])

  const getOfferings = useCallback(async () => {
    try {
      setIsLoading(true);
      const offerings = await Purchases.getOfferings();
      console.log(offerings.all['credit_offerings'])
      if (offerings.current !== null) {
        setPackages(offerings.all['credit_offerings'].availablePackages.sort((a, b) => a.product.price - b.product.price));
        setOfferingsMetadata(offerings.all['credit_offerings'].metadata as IPackageConfig);
        console.log(offerings.all['credit_offerings'].metadata as IPackageConfig)
        // setOfferingsMetadata(offerings.current.metadata as { [key: string]: ISubscriptionConfig });
        setSelectedPackage(offerings.all['credit_offerings'].availablePackages[1]);
      }
      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePurchaseError = useCallback(() => {
    Toast.showWithGravityAndOffset(
      Strings.paywall.purchaseError,
      Toast.LONG,
      Toast.TOP,
      0,
      40
    )
  }, []);

  const handleMakingPurchase = useCallback(async () => {
    if (selectedPackage !== null) {
      try {
        setIsLoading(true);
        const { customerInfo, productIdentifier } = await Purchases.purchasePackage(selectedPackage);
        console.log('Customer Info:', customerInfo);
        console.log('Product Identifier:', productIdentifier);
        setIsLoading(false);
      } catch (e) {
        console.log(e);

        const err = e as PurchasesError;
        if (!err.userCancelled) {
          handlePurchaseError();
        }
        setIsLoading(false);
      } finally {
        setIsLoading(false);
        if (navigation.canGoBack()) {
          navigation.goBack();
        }
      }
    }
  }, [selectedPackage]);

  const handleGoBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, []);

  useEffect(() => {
    getOfferings();
  }, [])

  const BenefitInfo = ({ amount, description }: { amount: number, description: string }) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
        <Text style={[Typography.title]}>~{formatNumber(amount)}</Text>
        <Text> {description}</Text>
      </View>
    )
  };

  return (
    <View style={styles.container}>
      <Pressable
        hitSlop={10}
        onPress={handleGoBack}
        style={(pressed) => [getPressableStyle(pressed), styles.closeBtn]}
      >
        <Ionicons name={"close"} size={26} color={Colors.black_two} />
      </Pressable>
      <SvgXml xml={OuterSpaceXML} width={'30%'} height={'20%'} />

      {offeringsMetadata && selectedPackage && (
        <View style={{ alignSelf: 'center', gap: Spacing.XXS }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text>{Strings.paywall.youWillReceived}</Text>
            {/* @ts-ignore */}
            <Text style={[Typography.title, { fontWeight: '800' }]}> {offeringsMetadata.amount[selectedPackage?.identifier]} </Text>
            <Text>{Strings.paywall.queryCredit}</Text>
          </View>
          <Text style={[Typography.body]}>{Strings.paywall.thisMeanYouHave}</Text>
          <BenefitInfo amount={selectedAmount / offeringsMetadata.cost.snap_free_text} description={Strings.paywall.freeTextSnap} />
          <BenefitInfo amount={selectedAmount / offeringsMetadata.cost.snap_equation_text} description={Strings.paywall.equationTextSnap} />
          <BenefitInfo amount={selectedAmount * offeringsMetadata.cost['gpt-3.5']} description={Strings.paywall.gpt35Token} />
          <BenefitInfo amount={selectedAmount * offeringsMetadata.cost['gpt-4']} description={Strings.paywall.gpt4Token} />
          <BenefitInfo amount={selectedAmount * offeringsMetadata.cost['llama-13b']} description={Strings.paywall.llamaToken} />
        </View>
      )}

      {packages && packages.length > 0 && (
        <View style={styles.bottomView}>
          {packages.map((item, index) =>
            <ConsumableProduct
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
          label={Strings.paywall.purchase}
          onPress={handleMakingPurchase}
          style={styles.purchaseBtn}
          isLoading={isLoading}
        />
      </View>
    </View >
  )
};

export default Packages;

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
  closeBtn: {
    position: 'absolute',
    top: Spacing.L,
    right: 0,
    width: 44,
    height: 44,
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
  purchaseBtn: {
    width: '100%',
    borderRadius: 16,
  },
});
