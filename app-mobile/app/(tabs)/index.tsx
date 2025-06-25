import { Dimensions, FlatList, SafeAreaView, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

import DotLoader from '@/components/ui/DotLoader';
import { CardsContext } from '@/context/cards-context';
import { Card } from "@/types/types";
import { router } from "expo-router";
import React, { useContext } from "react";

const itemMargin = 10;
const numColumns = 2;
const screenWidth = Dimensions.get('window').width;
const horizontalPadding = 20;
const itemWidth = (screenWidth - horizontalPadding * 2 - itemMargin * numColumns) / numColumns;

export default function HomeScreen() {
  const context = useContext(CardsContext);
  const cards = context?.cards;

  if (!cards || cards.length === 0) {
    return (
      <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24}} >Scan your first card  </Text>
          <DotLoader size={8} color="#262626" spacing={8}  />
        </View>
      </SafeAreaView>
    )
  }

  const renderItem = ({ item, index }: { item: Card; index: number }) => {
    const isLeftColumn = index % numColumns === 0;

    const itemStyle : StyleProp<ViewStyle> = {
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
