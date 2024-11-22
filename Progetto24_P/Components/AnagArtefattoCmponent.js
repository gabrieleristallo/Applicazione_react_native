import { Component } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Base64ImageComponent from './Base64ImageComponent';

export default class AnagArtefattoComponent extends Component {
  
    render() {
      const tipo = this.props.data[1];
      const object = this.props.data[0];
      if(object == null || object == "") {
        return (
          <View style={styles.container}>
            <View style={styles.leftContainer}>
              <Base64ImageComponent data={"-1"} width={60} height={60}/>
            </View>
            <View style={styles.containerPlaceHolder}>
              <Text style={styles.placeholderTitle}>{tipo}</Text>
              <Text style={styles.description}>Non equipaggiato</Text>
            </View>
          </View>
          

        )
      } else {


        //else branch
        return (<View style={styles.container}>
                    <View style={styles.leftContainer}>
                        <Base64ImageComponent data={object.image} width={60} height={60}/>
                    </View>
                    <View style={styles.rightContainer}>
                        <Text style={styles.title}>{tipo}</Text>
                        <Text style={styles.description}>{object.name}</Text>
                    </View>
                    <TouchableOpacity onPress={this.props.onPress} style={styles.buttonContainer}>
                        <Text style={styles.buttonText}>{'→'}</Text>
                    </TouchableOpacity>
                </View>);
      }
    }
}

const styles = StyleSheet.create({
    containerPlaceHolder: {
      height: 80,
    },
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    borderBot: {
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    leftContainer: {
      marginRight: 16,
    },
    image: {
      width: 80,
      height: 80,
      borderRadius: 40,
    },
    rightContainer: {
      flex: 1,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    description: {
      fontSize: 16,
    },
    buttonContainer: {
      marginLeft: 16,
      alignItems: 'center',
      alignContent: 'center',
      width: 40,
      height: 40,
      padding: 10,
      backgroundColor: '#3498db',
      borderRadius: 20,
    },
    placeholderTitle: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    buttonText: {
      color: 'white',
      fontSize: 13,
      paddingTop: 2
    },
  });