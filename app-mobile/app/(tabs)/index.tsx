import {StyleSheet, View, Text, Button, FlatList, SafeAreaView} from 'react-native';

import {CardsContext} from '@/context/cards-context';
import {Card} from "@/types/types";
import React, {useContext} from "react";

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
      <View style={styles.container}>
        <FlatList
          data={cards}
          keyExtractor={(item: Card) => item.id.toString()}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
{/*
              <Button title="Delete" color="red" onPress={() => handleDeleteCard(item.id)} />
*/}
            </View>
          )}
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
