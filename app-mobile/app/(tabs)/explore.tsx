import DropdownComponent from "@/components/ui/DropDown";
import { Link } from "expo-router";
import React, { useContext, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { CardsContext } from '../../context/cards-context';
import { Card } from '../../types/types';

const CardsScreen: React.FC = () => {
  const context = useContext(CardsContext);

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { cards, handleAddCard, handleDeleteCard } = context;
  const [name, setName] = useState('');
  const [barcodeValue, setBarcodeValue] = useState('');
  const [barcodeType, setBarcodeType] = useState('');

  const data = [
    { label: 'QR Code', value: 'qr' },
    { label: 'Code 128', value: 'code128' },
  ];
  
  return (
    <View style={styles.container}>
      <Text>Card Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Card Name"
        value={name}
        onChangeText={setName}
      />
      <Text>Barcode</Text>
      <TextInput
        style={styles.input}
        placeholder="Barcode Value"
        value={barcodeValue}
        onChangeText={setBarcodeValue}
      />
      
      <DropdownComponent data={data} label="Type" 
          onChange={(item) => { setBarcodeType(item.value); }}
          value={barcodeType}
          placeholder="Select Barcode Type"
           />

      <Button title="Add Card" 
        onPress={() => {
          if (name && barcodeValue && barcodeType) {
            handleAddCard(name, barcodeValue, barcodeType);
            setName('');
            setBarcodeValue('');
            setBarcodeType('');
          }
        }} 
      />

      <FlatList
        data={cards}
        keyExtractor={(item: Card) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.name} {item.id}</Text>
            <Text>Barcode: {item.barcode_value} ({item.barcode_type})</Text>
            <Link href={{
              pathname: '/details/[id]',
              params: { id: item.id.toString() },
            }}>Details</Link>
            <Button title="Delete" color="red" onPress={() => handleDeleteCard(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

const Screen3: React.FC = () => {
  return (
      <CardsScreen />
  );
};

export default Screen3;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 60 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  card: { padding: 15, borderBottomWidth: 1, marginBottom: 10, color: 'white' },
  title: { fontWeight: 'bold', fontSize: 18, color: 'white' },
});
