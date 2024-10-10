import { Component } from "react";
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Base64ImageComponent from './Base64ImageComponent';


export default class AnagComponent extends Component {
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.leftContainer}>
                    <Base64ImageComponent data={this.props.data.image} width={100} height={100}/>
                </View>
                <View style={styles.rightContainer}>
                    <Text style={styles.username}>{this.props.data.name}</Text>
                    <View style={styles.pointsContainer}>
                    <Text style={styles.pointsText}>Life: {this.props.data.life}</Text>
                    <Text style={styles.pointsText}>Experience: {this.props.data.experience}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 20,
      fontWeight: 'bold',
    },
    text: {
      fontSize: 15,
    },
    list: {
      paddingTop: 20,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
      },
      leftContainer: {
        marginRight: 16,
      },
      userImage: {
        width: 100,
        height: 100,
        borderRadius: 40,
      },
      rightContainer: {
        flex: 1,
      },
      username: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      pointsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
      },
      pointsText: {
        fontSize: 16,
      },
  });