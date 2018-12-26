import React, { Component } from 'reactn';
import { StyleSheet, Text, View, Image, StatusBar } from 'react-native';

class SearchPlaces extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        StatusBar.setBackgroundColor('#2874A6', true);
    }

    render() {
        return (           
            <View style={styles.container}>
                <Image source={require('../../assets/Heart.gif')}  style={{width: 100, height: 100, margin:10 }}/>                
                <Text style={{ fontFamily: 'Pom', fontSize: 22}}>Loading Surprises...</Text>
            </View>           
        );
    }
}

export default SearchPlaces;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#D6EAF8'
    }
});
