import React, { Component } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default class SwitchPositionComponent extends Component {

  render() {
    //condiziona la visualizzazione rispetto al dato passavo (posizione attiva o no)
    //al toocco dell'utente chiama la funzione in App.js
    return (
      <View style={styles.container}>
        <Text style={styles.labelText}>{this.props.data ? "Posizione attiva" : "Attiva la posizione"}</Text>
        <Switch
          value={this.props.data}
          onValueChange={this.props.onValueChange}
          thumbColor={this.props.data ? '#fff' : '#3498db'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  labelText: {
    fontSize: 16,
    marginRight: 16,
  },
});
