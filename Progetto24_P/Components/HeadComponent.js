import React, { Component } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

export default class HeadComponent extends Component {

  fetchClassifica() {
    if(this.props.data.title == "Classifica") {
      return (
        <Text style={styles.titleR}>{this.props.data.title}</Text>
      )
    } else {
      return (
        <Text style={styles.title}>{this.props.data.title}</Text>
      )
    }
  }

  render() {
    return (
      <View style={styles.header}>
        <View style={styles.leftButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.props.onLeftPress}>
            <Text style={styles.buttonText}>{this.props.data.left}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          {this.fetchClassifica()}
        </View>
        <View style={styles.rightButtonContainer}>
          <TouchableOpacity style={styles.button} onPress={this.props.onRightPress}>
            <Text style={styles.buttonText}>{this.props.data.right}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleR: {
    color: 'white',
    fontSize:28.5714,
    fontWeight: 'bold',
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  leftButtonContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  rightButtonContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  buttonText: {
    color: 'black',
    fontSize: 15,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
