import {StyleSheet, View, Text, FlatList, SafeAreaView, TouchableOpacity, Button, Dimensions} from 'react-native';

import {CardsContext} from '@/context/cards-context';
import {Card} from "@/types/types";
import React, {useContext} from "react";
import {Link, router} from "expo-router";

const itemMargin = 10;
const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 20;
const itemWidth = (screenWidth - horizontalPadding * 2 - itemMargin * numColumns) / numColumns;

export default function HomeScreen() {
  const context = useContext(CardsContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const {cards, handleDeleteCard} = context;

  if (!context) {
    return (
      <SafeAreaView>
        <Text>Scan your first card !</Text>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item, index }: { item: Card; index: number }) => {
    const isLeftColumn = index % numColumns === 0;

    const itemStyle = {
      width: itemWidth,
      marginRight: isLeftColumn ? itemMargin : 0,
      marginBottom: itemMargin,
      backgroundColor: "#3498db",
      padding: 20,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: "center",
    };

    return (
      <TouchableOpacity
        onPress={() => {
          // Imperative navigation if needed
          router.push({
            pathname: "/details/[id]",
            params: { id: item.id.toString() },
          });
        }}
        style={itemStyle}
      >
        <Text style={styles.text}>{item.name}</Text>
      </TouchableOpacity>
    );
  };


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
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  flatListContainer: {
    paddingTop: 10,
  },
  item: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    height: 20
  },
});
