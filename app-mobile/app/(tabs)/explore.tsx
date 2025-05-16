import Button from "@/components/ui/Button";
import DropdownComponent from "@/components/ui/DropDown";
import Input from "@/components/ui/Input";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useContext, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
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
    { label: 'Select type', value: '' },
    { label: 'QR Code', value: 'qr' },
    { label: 'Code 128', value: 'code128' },
  ];

  const addCard = () => {
    if (name && barcodeValue && barcodeType) {
      handleAddCard(name, barcodeValue, barcodeType);
      setName('');
      setBarcodeValue('');
      setBarcodeType('');
    }
  }
  
  return (
    <View style={styles.container}>
      <Input label="Card Name" value={name} onChangeText={setName}></Input>
      <Input label="Barcode Value" value={barcodeValue} onChangeText={setBarcodeValue}></Input>
      <DropdownComponent data={data} label="Type" 
          onChange={(item) => { setBarcodeType(item.value); }}
          value={barcodeType}
          placeholder="'Select Barcode Type'"
           />

    <Button
      style={styles.button}
      title="Add Card"
      icon={ 
        <AntDesign style={{ marginRight: 8}}
          name="plus"
          size={18}
          color="white"
        />
      }
      iconPosition="left"
      onPress={() => { addCard(); }}
    />

      <FlatList
        data={cards}
        keyExtractor={(item: Card) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Text style={styles.title}>{item.name} {item.id}</Text>
            <Text>Barcode: {item.barcode_value} ({item.barcode_type})</Text>
            </View>
            <Link href={{
              pathname: '/details/[id]',
              params: { id: item.id.toString() },
            }}>Details</Link>
             <AntDesign
              name="delete"
              size={18}
              color="red"
              onPress={() => handleDeleteCard(item.id)}
            />
            {/* <Button title="Delete" color="red" onPress={() => handleDeleteCard(item.id)} /> */}
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
  container: { flex: 1, paddingHorizontal: 16 , marginTop: 24 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
  card: { padding: 15, borderBottomWidth: 1, marginBottom: 10, color: 'white', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 18, color: 'white' },
  button: { marginVertical: 24}
});
