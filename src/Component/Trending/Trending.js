import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { generateRandomPoints } from '../../Helper/RandomGeo'
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
        <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={() => navigation.toggleDrawer()}>
          <Icon name="navicon" size={25} color="#E8DAEF" />
        </TouchableOpacity>
      )
    };
  };

  openSearchModal = () => {
    console.log("openSearchModal");
    RNGooglePlaces.openAutocompleteModal()
      .then((place) => {
        console.log(place);
        console.log("Address: " + place.address + ", Name: " + place.name);
        this.placeDataGet(place.address);
      })
      .catch(error => console.log("Error!"));
  }

  getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(Math.abs(lat2) - Math.abs(lat1));  // deg2rad below
    var dLon = this.deg2rad(Math.abs(lon2) - Math.abs(lon1));
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
      ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad = (deg) => {
    return deg * (Math.PI / 180)
  }

  placeDataGet = (place) => {
    const { width, height } = Dimensions.get('window');
    const ASPECT_RATIO = width / height;

    let endpoint = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22${place}%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&formal=json`
    fetch(endpoint).then(response => response.json()).then(data => {
      let tempData = [];
      if (data.query.count == 1) {
        tempData.push(data.query.results.place);
      }
      else {
        tempData.push(data.query.results.place[0]);
      }
      let result = tempData[0];
      console.log(data)

      const lat = parseFloat(result.centroid.latitude);
      const lng = parseFloat(result.centroid.longitude);
      const northeastLat = parseFloat(result.boundingBox.northEast.latitude);
      const southwestLat = parseFloat(result.boundingBox.southWest.latitude);
      const latDelta = northeastLat - southwestLat;
      const lngDelta = latDelta * ASPECT_RATIO;

      console.log(lat + " " + lng + " " + latDelta + " " + lngDelta)
      let distance = this.getDistanceFromLatLonInKm(result.boundingBox.northEast.latitude, result.boundingBox.northEast.longitude, result.boundingBox.southWest.latitude, result.boundingBox.southWest.longitude);
      console.log("Distance: ", distance);
      let randomGeoPoints = generateRandomPoints({ 'lat': lat, 'lng': lng }, distance * 100, 100);

      this.setState({
        region: {
          latitude: lat,
          longitude: lng,
          latitudeDelta: latDelta,
          longitudeDelta: lngDelta
        },
        randomPoints: randomGeoPoints
      })
    })
  }

  componentDidMount() {
    this.props.navigation.setParams({ openSearchModal: this.openSearchModal })
  }

  onRegionChange(region) {
    //console.log("Region", region)
  }

  onMapLongPress(coordinate) {
    //console.log("Co-ordinate", coordinate.nativeEvent)
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
          onRegionChange={this.onRegionChange}
          onLongPress={this.onMapLongPress}
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
