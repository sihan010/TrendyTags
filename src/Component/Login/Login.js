import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import twitter, { auth } from 'react-native-twitter';
import Icon from 'react-native-vector-icons/FontAwesome'
import MapScreen from '../../screens/MapScreen'

class SearchPlaces extends Component {
    constructor(props) {
        super(props);
    }

    loginWithTwitter = () => {
        console.log(this.global.tokens);
        auth(this.global.tokens, 'http://trandytags.com/auth')
            .then(({ accessToken, accessTokenSecret, id, name }) => {
                const tokens = { ...this.global.tokens, accessToken, accessTokenSecret };
                const authData = {
                    authorized: true,
                    tokens,
                    twitter: twitter(tokens),
                    twitterUserName: name,
                    twitterUserID: id
                };
                console.log(authData);
                this.setGlobal(authData);
                AsyncStorage.setItem('twitter@tokens', JSON.stringify(authData))
                    .then(success => console.log("Success! Login Data Saved"))
                    .catch(err => console.log("Error from Login AsyncStorage: ", err));
            }).catch(err => console.log("Error from login Twitter: ", err));
    }

    render() {
        return (           
            this.global.authorized ?
                <MapScreen/>
            :
                <View style={styles.container}>
                    <Image source={require('../../assets/logo.png')} style={{height:300, width:300, margin:20}}/>
                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity
                            style={{flexDirection: 'row', borderWidth:2, borderRadius:10, borderColor:'#1DA1F2', margin:10 }}
                            onPress={() => this.loginWithTwitter()}>
                            <Icon name='twitter' size={25} color='#1DA1F2' style={{margin:10}} />
                            <Text style={{ fontFamily: 'Pom', fontSize: 22, margin:10 }}>Sign In with Twitter</Text>
                        </TouchableOpacity>                    
                    </View>             
                    <Text style={{ fontFamily: 'Pom', fontSize: 20, margin:10, alignSelf:'center' }}>To continue, You need to log in with your Twitter account</Text>
                    <Text style={{ fontFamily: 'Pom', fontSize: 20, margin:10, color:'#CD6155', alignSelf:'center' }}>Note That, We do not store or request any personal content.</Text>
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
