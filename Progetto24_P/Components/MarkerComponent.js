import React from "react";
import { Image } from 'react-native';
import {Marker} from 'react-native-maps'
import { TouchableOpacity } from "react-native";
import Base64ImageComponent from "./Base64ImageComponent";

export default class MarkerComponent extends React.Component {


    fetchImage() {
        if(this.props.image != null && this.props.image != null && this.props.type == "Object") {
            return <Base64ImageComponent data={this.props.image} width={30} height={30}/>
        } else if(this.props.type == "Object") {
            console.log("if obj");
            return (
                <Image
                source={require('../assets/obj_icon.webp')} // Percorso dell'immagine
                style={{ width: 30, height: 30 }} // Imposta le dimensioni desiderate
              />
            )
        } else if(this.props.type == "User") {
            console.log("if user")
            return (
                <Image
                source={require('../assets/user_icon.webp')} // Percorso dell'immagine
                style={{ width: 30, height: 30 }} // Imposta le dimensioni desiderate
              />
            )
        }
        return;
    }

    render() {
        //console.log("propsAAA", this.props)
        console.log("PROPSTTTT", this.props.type)
        return (
            <Marker
                key={this.props.data[1]}
                coordinate={{latitude: this.props.data[0].lat, longitude: this.props.data[0].lon}}
                title={this.props.data[0].name}
                onPress={this.props.onPress}
                pinColor={this.props.data[0].name == "Me" ? "green" : "red"}
                zIndex={this.props.data[0].name == "Me" ? 2 : 0}
            >
                {this.fetchImage()}
          </Marker>
        );
    }
}