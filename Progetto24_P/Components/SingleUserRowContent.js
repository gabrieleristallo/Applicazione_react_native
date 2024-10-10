import React, { Component } from 'react';
import { StyleSheet, Text, View , Button, TouchableOpacity } from 'react-native';
import ComunicationController from '../ComunicationController';
import Base64ImageComponent from './Base64ImageComponent';

export default class SingleUserRowContent extends Component {

  fetchRank() {
    if(this.props.data.lenght == 1) {
      //caso in cui non è un elemento della classifica ma della lista di utenti vicini
      return;
    } else {
      const rank = this.props.data[1];
      //cambia i colori al primo, secondo e terzo posto
      if(rank == 1) {
        return (
          <View style={styles.rankContainer}>
            <Text style={[styles.rank, styles.goldText]}>{this.props.data[1]}</Text>
          </View>
        );
      } else if(rank == 2) {
        return (
          <View style={styles.rankContainer}>
            <Text style={[styles.rank, styles.silverText]}>{this.props.data[1]}</Text>
          </View>
        );
      } else if(rank == 3) {
        return (
          <View style={styles.rankContainer}>
            <Text style={[styles.rank, styles.bronzeText]}>{this.props.data[1]}</Text>
          </View>
        );
      }
      return (
        <View style={styles.rankContainer}>
          <Text style={styles.rank}>{this.props.data[1]}</Text>
        </View>
      );
    }
  }

    render() {
        return (
            <View>
              <TouchableOpacity onPress={this.props.onPress} style={styles.profileContainer}>
                {this.fetchRank()}
                <View style={styles.userInfo}>
                    <Base64ImageComponent style={styles.userImage} data={this.props.data[0].picture} width={50} height={50}/>
                    <View style={styles.textContainer}>
                        <Text style={styles.username}>{this.props.data[0].name}</Text>
                        <View style={styles.stats}>
                            <Text style={styles.life}>life: {this.props.data[0].life}</Text>
                            <Text style={styles.exp}>exp: {this.props.data[0].experience}</Text>
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
        padding: 20,
      },
      rankContainer: {
        marginRight: 20,
      },
      rank: {
        fontSize: 24,
        fontWeight: 'bold',
      },
      goldText: {
        color: '#FFD700',
      },
      silverText: {
        color: '#C0C0C0',
      },
      bronzeText: {
        color: '#804A00',
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

