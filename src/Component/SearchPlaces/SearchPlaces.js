import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import RNGooglePlaces from 'react-native-google-places';
import twitter, {auth} from 'react-native-twitter';

class SearchPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false,
      tokens: {
        consumerKey: 'yvaGytDxOKPgX718WdaNpgUkz',
        consumerSecret: 'NsHSq5UDUT8gFjGdlV5wg2qRcTCa4KDz6379c9hDiEQtWXBhGN'
      },
      twitter: null,
    }
  }
  openSearchModal() {
    auth(this.state.tokens, 'http://trandytags.com/auth')
      .then((cred) => {
        //const tokens = { ...this.state.tokens, accessToken, accessTokenSecret };
        console.log(cred);
      }).catch(err=>console.log(err));
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.openSearchModal()}>
          <Text>Authorize</Text>
        </TouchableOpacity>
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
  }
});
