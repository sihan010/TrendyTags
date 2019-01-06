import React, { Component } from 'reactn';
import { AsyncStorage, PermissionsAndroid } from 'react-native'
import RNGooglePlaces from 'react-native-google-places';
import { regionBuilder } from './src/Helper/RandomGeo'
import Navigator from './src/screens/MapScreen'
import Loading from './src/Component/Loading'

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
      region: null,
      currentLocation: null,
      loading: true,
      placeName: null
    })
  }

  componentDidMount() {
    AsyncStorage.getItem('twitter@tokens')
      .then((data) => {
        if (data) {
          let authData = JSON.parse(data);
          this.setGlobal(authData);
        }
      }).catch(err => console.log("App.js AsyncStorage Error: ", err));
    this.getCurrentPlace();
  }

  getCurrentPlace = async () => {
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
            let currentLocationA = [];            
            currentLocationA[0] = results[0];
            for (let i = 1; i < results.length; i++) {
              if (results[i].likelihood > currentLocationA[0].likelihood)
              currentLocationA[0] = results[i];
            }
            let currentLocation = currentLocationA[0];
            const region = regionBuilder(currentLocation.latitude, currentLocation.longitude, currentLocation.north, currentLocation.south)
            let regionData = { region, currentLocation };
            this.setGlobal(regionData);
            this.setGlobal({placeName:currentLocation.name, loading:false})
          })
          .catch((error) => {
            console.log(error.message);
            this.setGlobal({
              region: {
                latitude: 48.85693,
                longitude: 2.3412,
                latitudeDelta: 0.3886490000000009,
                longitudeDelta: 0.23396929765886343
              },
              currentLocation: {
                "west": 2.224199,
                "south": 48.815573,
                "east": 2.4699207999999997,
                "north": 48.902144899999996,
                "longitude": 2.3522219000000004,
                "latitude": 48.85661400000001
              },
              placeName:'Paris, France',
              loading:false
            })
          });
      }
      else {
        console.log("Location permission denied");
        this.setGlobal({
          region: {
            latitude: 48.85693,
            longitude: 2.3412,
            latitudeDelta: 0.3886490000000009,
            longitudeDelta: 0.23396929765886343
          },
          currentLocation: {
            "west": 2.224199,
            "south": 48.815573,
            "east": 2.4699207999999997,
            "north": 48.902144899999996,
            "longitude": 2.3522219000000004,
            "latitude": 48.85661400000001
          },
          placeName:'Paris, France',
          loading:false
        })
      }
    }
    catch (error) {
      console.log("Error!", error)
    }
  }

  render() {
    return (
      this.global.loading?
        <Loading />
        :
       <Navigator />
    );
  }
}
