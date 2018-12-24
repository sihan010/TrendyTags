import React, { Component } from 'reactn';
import { AsyncStorage, StatusBar, PermissionsAndroid } from 'react-native'
import Login from './src/Component/Login'
import RNGooglePlaces from 'react-native-google-places';
import {regionBuilder} from './src/Helper/RandomGeo'

export default class App extends Component {
//node_modules\react-native-gesture-handler\DrawerLayout.js 
//  import {
//    PanGestureHandler,
//    TapGestureHandler,
//    State,
//  } from './GestureHandler';
  constructor(props) {
    super(props);
    this.setGlobal({
      authorized: false,
      tokens: {
        consumerKey: 'yvaGytDxOKPgX718WdaNpgUkz',
        consumerSecret: 'NsHSq5UDUT8gFjGdlV5wg2qRcTCa4KDz6379c9hDiEQtWXBhGN',
        accessToken: '',
        accessTokenSecret: ''
      },
      twitter: null,
      twitterUserName: '',
      twitterUserID: '',
      region:null,
      currentLocation:null
    })
  }

  componentDidMount() {
    StatusBar.setBackgroundColor('#2874A6',true);
    AsyncStorage.getItem('twitter@tokens')
      .then((data) => {
        if (data) {
          let authData = JSON.parse(data);
          //console.log(authData);
          this.setGlobal(authData);
        }
      }).catch(err => console.log("App.js AsyncStorage Error: ", err));
      this.getCurrentPlace();
  }

  getCurrentPlace = async () =>{
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Location Permission',
          'message': 'TrendyTags needs access to your GPS informations to get nearby Trends',
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        RNGooglePlaces.getCurrentPlace()
          .then((results) => {
            let currentLocation = results[0];
            for (let i = 1; i < results.length; i++) {
              if (results[i].likelihood > currentLocation.likelihood)
                currentLocation = results[i];
            }
            const region = regionBuilder(currentLocation.latitude, currentLocation.longitude, currentLocation.north, currentLocation.south)
            this.setGlobal({
              region: region,
              currentLocation: currentLocation
            })
          })
          .catch((error) => console.log(error.message));
      }
      else {
        console.log("Location permission denied")
      }
    }
    catch (error) {
      console.log("Error!", error)
    }
  }

  render() {
    return (
      <Login />
    );
  }
}
