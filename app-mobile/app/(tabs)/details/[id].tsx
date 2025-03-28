import {StyleSheet, View, Text, Button, FlatList, SafeAreaView} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {CardsContext} from '@/context/cards-context';
import React, {useContext} from "react";
import { Barcode } from 'expo-barcode-generator';
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabaseSync('card-stash.db');

if (!db) {
  console.error('Database failed to initialize.');
}

const fetchDataFromSQLite = (id) => {
  try {
    const firstRow = db.getFirstSync('SELECT * FROM cards WHERE id = ?', id);
    // @ts-ignore
    return firstRow;

  } catch (error) {
    console.error(error);
    throw Error('Failed to get cards !!!');
  }
};

export default function HomeScreen() {
  const context = useContext(CardsContext);
  const { id } = useLocalSearchParams();
  const card = fetchDataFromSQLite(id);
  // @ts-ignore
  const value = card.barcode_value;

  // @ts-ignore
  // @ts-ignore
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Barcode
        value={ card.barcode_value }
        options={{ format: card.barcode_type, background: 'lightblue' }}
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
