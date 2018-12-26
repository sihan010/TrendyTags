import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, AsyncStorage, Image, StatusBar } from 'react-native';
import twitter, { auth } from 'react-native-twitter';
import Icon from 'react-native-vector-icons/FontAwesome'

class SearchPlaces extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount(){
        StatusBar.setBackgroundColor('#2874A6', true);
    }

    static navigationOptions = {
        header: null
    }

    loginWithTwitter = () => {
        console.log(this.global.tokens);
        auth(this.global.tokens, 'https://trendytags.com/auth')
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
                <View style={styles.container}>
                    <Image source={require('../../assets/logo.png')} style={{height:300, width:300, margin:1}}/>
                    <Text style={{fontFamily: 'Lobster', fontSize: 26, color:'#2874A6', marginBottom:20}}>TrendyTags</Text>
                    <Text style={{fontFamily: 'Pom', fontSize: 22}}>You are Signed In !</Text>
                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity
                            style={{flexDirection: 'row', borderWidth:2, borderRadius:10, borderColor:'#1DA1F2', margin:10, alignItems:'center', justifyContent:'center' }}
                            onPress={() => this.props.navigation.navigate("Trending")}>
                            <Text style={{ fontFamily: 'Pom', fontSize: 22, margin:10 }}>Continue to Application</Text>
                            <Icon name="long-arrow-right" size={22} color='#2874A6' style={{marginRight:10}} />
                        </TouchableOpacity>                    
                    </View> 
                    <Text style={{ fontFamily: 'Pom', fontSize: 20, margin:10, color:'#CD6155', alignSelf:'center' }}>We Don't Store or Request ANY Personal Content</Text>
                </View>
            :
                <View style={styles.container}>
                    <Image source={require('../../assets/logo.png')} style={{height:300, width:300, margin:1}}/>
                    <Text style={{fontFamily: 'Lobster', fontSize: 26, color:'#2874A6', marginBottom:20}}>TrendyTags</Text>
                    <Text style={{fontFamily: 'Pom', fontSize: 22}}>Sign In with Existing Twitter Account</Text>
                    <View style={{flex: 1, flexDirection: 'row', alignItems:'center', justifyContent:'center'}}>
                        <TouchableOpacity
                            style={{flexDirection: 'row', borderWidth:2, borderRadius:10, borderColor:'#1DA1F2', margin:10 }}
                            onPress={() => this.loginWithTwitter()}>
                            <Icon name='twitter' size={25} color='#1DA1F2' style={{margin:10}} />
                            <Text style={{ fontFamily: 'Pom', fontSize: 22, margin:10 }}>Sign In with Twitter</Text>
                        </TouchableOpacity>                    
                    </View>
                    <Text style={{ fontFamily: 'Pom', fontSize: 20, margin:10, color:'#CD6155', alignSelf:'center' }}>We Don't Store or Request ANY Personal Content</Text>
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
