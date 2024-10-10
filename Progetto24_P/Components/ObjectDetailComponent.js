import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Base64ImageComponent from './Base64ImageComponent';

class UserDetailComponent extends React.Component {
  render() {
    const { data } = this.props;

    //console.log("data: ", data);

    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Base64ImageComponent style={styles.image} data={data.image} width={150} height={150} />
        </View>
        <Text style={styles.username}>{data.name}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.stats}>{data.type}</Text>
          <Text style={styles.stats}>L. {data.level}</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    paddingTop: 40,
    paddingBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  username: {
    marginTop: 10,
    fontSize: 30,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  stats: {
    marginHorizontal: 20,
    fontSize: 16,
  },
});

export default UserDetailComponent;
