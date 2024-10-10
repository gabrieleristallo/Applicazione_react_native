import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
//import ImagePicker from 'react-native-image-picker';

//!!!Questa componente quando viene richiamata va in crash!!!

const ImageUploadComponent = ({ onImageSelected }) => {
  const [imageSource, setImageSource] = useState(null);

  const handleImagePicker = () => {
    const options = {
      title: 'Seleziona un\'immagine',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('Selezione annullata');
      } else if (response.error) {
        console.log('Errore durante la selezione dell\'immagine:', response.error);
      } else {
        const source = { uri: response.uri };
        setImageSource(source);

        // Chiamare la funzione di callback passata come prop
        onImageSelected(response.uri);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImagePicker} style={styles.button}>
        <Text style={styles.buttonText}>Scegli un'immagine</Text>
      </TouchableOpacity>

      {imageSource && (
        <Image source={imageSource} style={styles.imagePreview} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 20,
  },
});

export default ImageUploadComponent;
