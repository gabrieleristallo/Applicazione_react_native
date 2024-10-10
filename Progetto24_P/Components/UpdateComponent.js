import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import ComunicationController from '../ComunicationController';
import ImageUploadComponent from './ImageUploadComponent';

class UpdateComponent extends React.Component {
  state = {
    username: this.props.data[0].name,
    avatarSource: this.props.data[0].picture,
    updated: false,
    failed: false
  }

  updateProfile = async () => {
    // Implementa l'aggiornamento del profilo con le nuove informazioni
    console.log("Button clickd update confirm");
    console.log('Username:', this.state.username);
    console.log(this.props)
    try {
      const response = await ComunicationController.updateUser(this.props.data[1], this.props.data[0].uid, this.state.username, this.state.avatarSource, this.props.data[0].positionshare);
      this.setState({updated: true});
    } catch (error) {
      console.log(error);
      this.setState({failed: true});
    }
    
  };

render() {
  if (!this.state.updated && !this.state.failed) {
    return (
      <View style={styles.container}>
        <ImageUploadComponent onImageSelected={(avatarSource) => this.setState({ avatarSource })} />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={this.props.username}
          onChangeText={(text) => this.setState({ username: text })}
        />
        <TouchableOpacity onPress={this.updateProfile} style={styles.button}>
          <Text style={styles.buttonText}>Aggiorna Profilo</Text>
        </TouchableOpacity>
      </View>
    );
  } else if(this.state.updated && !this.state.failed) {
    return (<View style={styles.container}>
      <Text style={styles.text}>Aggiornamento avvenuto con successo</Text>
    </View>);
  } else if(this.state.failed) {
    return (<View style={styles.container}>
      <Text style={styles.text}>Qualcosa è andato storto</Text>
    </View>);
  }
  
}
  
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white', // Sfondo bianco
    padding: 20,
  },
  imageContainer: {
    marginBottom: 20,
  },
  avatarImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    fontSize: 16,
    color: 'black', // Testo nero
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'black', // Bordo nero
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: 'black', // Sfondo nero
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white', // Testo bianco
    fontSize: 16,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 15,
  }
});

export default UpdateComponent;
