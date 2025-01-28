import {StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity, Button} from 'react-native';

import {CardsContext} from '@/context/cards-context';
import {Card} from "@/types/types";
import React, {useContext} from "react";
import {Link} from "expo-router";

export default function HomeScreen() {
  const context = useContext(CardsContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { cards, handleDeleteCard } = context;

  if (!context) {
    return (
      <SafeAreaView>
        <Text>Scan your first card !</Text>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item }) => (
    <Link href={{
      pathname: '/details/[id]',
      params: { id: item.id.toString() },
    }}>
      <View style={styles.item}>
        <Text style={styles.text}>{item.name}</Text>
      </View>
    </Link>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: 'red',
          alignItems: 'center',
          justifyContent: 'center',
          width: 30,
          position: 'absolute',
          top: 10,
          right: 20,
          height: 30,
          backgroundColor: 'red',
          borderRadius: 100,
          zIndex: 999999
        }}
        onPress={() => { alert('Button is pressed') }}
      >
        <Text style={{ color: "white" }}>+</Text>
      </TouchableOpacity>
      <FlatList
        data={cards}
        renderItem={renderItem}
        keyExtractor={(item: Card) => item.id.toString()}
        numColumns={2} // Two items per row
        columnWrapperStyle={styles.row} // Ensures proper spacing
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  card: { padding: 15, borderBottomWidth: 1, marginBottom: 10, color: 'white' },
  title: { fontWeight: 'bold', fontSize: 18, color: 'white' },
  row: {
    justifyContent: "space-between",
    marginBottom: 10,
  },
  item: {
    flex: 1,
    backgroundColor: "#000000",
    padding: 20,
    marginHorizontal: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "50%"
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
