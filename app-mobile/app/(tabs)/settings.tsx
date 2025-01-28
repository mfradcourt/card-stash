import {Image, StyleSheet, Platform, Text} from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { View, Button, Alert } from "react-native";
import * as FileSystem from 'expo-file-system';
import {Barcode} from "expo-barcode-generator";
import React from 'react';
import * as SQLite from "expo-sqlite";
import * as Sharing from "expo-sharing";
import * as DocumentPicker from "expo-document-picker";


const db = SQLite.openDatabaseSync('card-stash.db');

if (!db) {
  console.error('Database failed to initialize.');
}

const fetchDataFromSQLite = async () => {
  try {
    // @ts-ignore
    const result = db.getAllSync(
      "SELECT * FROM cards"
    );

    return result;

  } catch (error) {
    console.error(error);
    throw Error('Failed to get cards !!!');
  }
};

const shareDatabaseData = async () => {
  try {
    const data = await fetchDataFromSQLite();

    // @ts-ignore
    if (!data.length) {
      Alert.alert("No Data", "No records found in the database.");
      return;
    }

    const jsonString = JSON.stringify(data, null, 2);
    const fileUri = FileSystem.cacheDirectory + "exportedData.json";

    await FileSystem.writeAsStringAsync(fileUri, jsonString, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri);
    } else {
      Alert.alert("Sharing not available", `File saved at: ${fileUri}`);
    }
  } catch (error) {
    // @ts-ignore
    Alert.alert("Error", "Could not fetch or share data: " + error.message);
  }
};

const insertDataIntoSQLite = (data) => {
    data.forEach((item) => {
      try {
        const now = new Date().toISOString();
        // @ts-ignore
        let result = db.runSync(
          `INSERT OR REPLACE INTO cards (id, name, barcode_value, barcode_type, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?);`,
          [item.id, item.name, item.barcode_value, item.barcode_type, item.created_at, item.updated_at],
        );
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    });
};

const importJsonToSQLite = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: "application/json" });

    if (result.canceled) {
      return;
    }

    const fileUri = result.assets[0].uri;
    const fileContent = await FileSystem.readAsStringAsync(fileUri);
    const jsonData = JSON.parse(fileContent);

    if (!Array.isArray(jsonData)) {
      Alert.alert("Invalid JSON", "The file should contain an array of objects.");
      return;
    }

    insertDataIntoSQLite(jsonData);
    Alert.alert("Success", "Data imported into SQLite!");
  } catch (error) {
    Alert.alert("Error", "Could not import data: " + error.message);
  }
};

export default function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Export & Share JSON" onPress={shareDatabaseData} />
      <Button title="Import JSON into SQLite" onPress={importJsonToSQLite} />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
