import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { generateRandomPoints, getDistanceFromLatLonInKm, regionBuilder } from '../../Helper/RandomGeo'
import RNGooglePlaces from 'react-native-google-places';

class SearchPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      region: {
        latitude: 48.85693,
        longitude: 2.3412,
        latitudeDelta: 0.3886490000000009,
        longitudeDelta: 0.23396929765886343
      },
      randomPoints: [],
      currentLocation: { "west": 2.224199, "south": 48.815573, "east": 2.4699207999999997, "north": 48.902144899999996, "types": ["locality", "political"], "placeID": "ChIJD7fiBh9u5kcRYJSMaMOCCwQ", "address": "Paris, France", "name": "Paris", "longitude": 2.3522219000000004, "latitude": 48.85661400000001 },
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'TrendyTags',
      headerStyle: {
        backgroundColor: '#1A5276',
      },
      headerTintColor: '#E8DAEF',
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Pom',
        fontWeight: '200'
      },
      headerRight: (
        <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={navigation.getParam('openSearchModal')}>
          <Icon name="search" size={25} color="#E8DAEF" />
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={() => navigation.openDrawer()}>
          <Icon name="navicon" size={25} color="#E8DAEF" />
        </TouchableOpacity>
      )
    };
  };

  openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal({ type: 'regions', useOverlay: false })
      .then((place) => {
        this.setState({
          currentLocation: place
        })
        this.placeDataGet(place.address);
      })
      .catch(error => console.log("Error!", error));
  }

  placeDataGet = (place) => {
    let endpoint = `https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%3D%22${place}%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&formal=json`
    fetch(endpoint).then(response => response.json()).then(data => {
      let tempData = [];
      data.query.count == 1 ? tempData.push(data.query.results.place) : tempData.push(data.query.results.place[0]);

      let result = tempData[0];
      console.log("WOEID: ", result.woeid)

      let distance = getDistanceFromLatLonInKm(this.state.currentLocation.south, this.state.currentLocation.west, this.state.currentLocation.north, this.state.currentLocation.east) * 300;
      console.log("Distance: ", distance * 50);

      let randomGeoPoints = generateRandomPoints({ 'lat': this.state.currentLocation.latitude, 'lng': this.state.currentLocation.longitude }, distance, 100);

      const region = regionBuilder(this.state.currentLocation.latitude, this.state.currentLocation.longitude, this.state.currentLocation.north, this.state.currentLocation.south)
      console.log("Region: ", region);

      this.setState({
        region: region,
        randomPoints: randomGeoPoints
      })
    }).catch(error => console.log("Error!", error));
  }

  async componentDidMount() {
    this.props.navigation.setParams({ openSearchModal: this.openSearchModal })
    //this.placeDataGet("Paris, France");
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
            this.setState({
              region: region,
              currentLocation: currentLocation
            })
            this.placeDataGet(currentLocation.address);
          })
          .catch((error) => console.log(error.message));
      }
      else {
        this.placeDataGet("Paris, France");
        console.log("Location permission denied")
      }
    }
    catch (error) {
      console.log("Error!", error)
    }
  }

  markerPress(coordinate, key) {
    console.log("Co-ordinate:", coordinate.nativeEvent)
    console.log("Key:", key)
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this.state.region}>
          {
            this.state.randomPoints.length > 0 ?
              this.state.randomPoints.map((item, key) => {
                return (
                  <Marker draggable
                    key={key}
                    coordinate={{ latitude: item.lat, longitude: item.lng }}
                    onPress={(e) => this.markerPress(e, key)}>
                    <View
                      style={{ backgroundColor: 'rgba(91, 44, 111,0.3)', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: 'Pom', fontSize: 22, color: '#283747' }}>{key}</Text>
                    </View>
                  </Marker>
                )
              })
              : null
          }
        </MapView>
      </View>
    );
  }
}

export default SearchPlaces;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
