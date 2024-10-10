import React, { Component } from 'react';
import { StyleSheet, Text, View , Button, TouchableOpacity } from 'react-native';
import ComunicationController from '../ComunicationController';
import Base64ImageComponent from './Base64ImageComponent';

export default class SingleUserRowContent extends Component {

    render() {
        return (
            <View>
              <TouchableOpacity onPress={this.props.onPress} style={styles.profileContainer}>
                <View style={styles.userInfo}>
                    <Base64ImageComponent style={styles.userImage} data={this.props.data.image} width={50} height={50}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.username}>{this.props.data.name}</Text>
                        <View style={styles.stats}>
                            <Text style={styles.life}>{this.props.data.type}</Text>
                            <Text style={styles.exp}>L. {this.props.data.level}</Text>
                        </View>
                    </View>
                </View>
              </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 40,
        padding: 20,
      },
      rankContainer: {
        marginRight: 20,
      },
      rank: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      userImage: {
        width: 25,
        height: 25,
        marginRight: 50,
        borderRadius: 25, // Per un'immagine rotonda, adatta il bordo alla tua esigenza
      },
      textContainer: {
        flexDirection: 'column',
        paddingLeft: 30
      },
      username: {
        fontSize: 18,
        fontWeight: 'bold',
      },
      stats: {
        marginTop: 5,
        flexDirection: 'row',
      },
      life: {
        fontSize: 14,
        marginBottom: 5,
      },
      exp: {
        marginLeft: 40,
        fontSize: 14,
      },
  });

