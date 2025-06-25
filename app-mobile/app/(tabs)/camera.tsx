import { CardsContext } from "@/context/cards-context";
import { Camera, CameraView } from 'expo-camera';
import { sleepAsync } from "expo-dev-launcher/bundle/functions/sleepAsync";
import React, { useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

const CameraScreen: React.FC = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  const context = useContext(CardsContext);

  useEffect (() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      // @ts-ignore
      setHasPermission(status === "granted");
    };

    getCameraPermissions();
  }, []);

  // @ts-ignore
  const handleBarCodeScanned = async ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      context!.handleAddCard('card x', data, type);

      await sleepAsync(1000);
    }
  };

  const renderCamera = () => {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13"],
          }}
          style={styles.camera}
        />
      </View>
    );
  };

  if (hasPermission === null) {
    return <View />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Camera permission not granted</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Barcode Scanner App!</Text>
      <Text style={styles.paragraph}>Scan a barcode to start your job.</Text>
      {renderCamera()}
      <Button title="Scan Again" onPress={() => setScanned(false)} />
    </View>
  );
}

export default CameraScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 40,
  },
  cameraContainer: {
    width: '80%',
    aspectRatio: 1,
    overflow: 'hidden',
    borderRadius: 10,
    marginBottom: 40,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
