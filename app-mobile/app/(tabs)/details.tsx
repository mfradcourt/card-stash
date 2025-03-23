import {StyleSheet, View, Text, Button, FlatList, SafeAreaView} from 'react-native';

import {CardsContext} from '../../context/cards-context';
import {Card} from "@/types/types";
import React, {useContext} from "react";
import { Barcode } from 'expo-barcode-generator';

export default function HomeScreen() {
  const context = useContext(CardsContext);

  if (!context) {
    return (
      <SafeAreaView>
        <Text>Scan your first card !</Text>
      </SafeAreaView>
    )
  }

  const { cards, handleDeleteCard } = context;

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Barcode
        value="123456789999"
        options={{ format: 'UPC', background: 'lightblue' }}
        rotation={-5}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 60,
    flex: 1,
    backgroundColor: '#fff',
  }
});
