import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, ToastAndroid, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { generateRandomPoints, getDistanceFromLatLonInKm, regionBuilder, colorSelector } from '../../Helper/RandomGeo'
import RNGooglePlaces from 'react-native-google-places';
import twitter from 'react-native-twitter'
import Loading from '../Loading'

class SearchPlaces extends Component {
  constructor(props) {
    super(props);
    this.state = {
      randomPoints: [],
      trends: [],
      loading: true
    }
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: 'TrendyTags',
      headerStyle: {
        backgroundColor: '#2874A6',
      },
      headerTintColor: '#D6EAF8',
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Lobster',
        fontWeight: '400'
      },
      headerLeft: (
        <View></View>
      ),
      headerRight: (
        <TouchableOpacity style={{ marginHorizontal: 15 }} onPress={navigation.getParam('openSearchModal')}>
          <Icon name="search" size={25} color="#D6EAF8" />
        </TouchableOpacity>
      )
    };
  };

  openSearchModal = () => {
    RNGooglePlaces.openAutocompleteModal({ type: 'regions', useOverlay: true })
      .then((place) => {
        let currentLocation = {
          "west": place.west,
          "south": place.south,
          "east": place.east,
          "north": place.north,
          "longitude": place.longitude,
          "latitude": place.latitude
        };
        this.setGlobal({
          currentLocation
        })
        this.nearbyTrendyPlace(currentLocation.latitude, currentLocation.longitude);
      })
      .catch(error => console.log("Error!", error));
  }

  nearbyTrendyPlace = (lat, lng) => {
    if (this.global.twitter !== null) {
      this.setState({ loading: true })
      const { rest } = twitter(this.global.tokens);
      return rest.get('trends/closest', { lat: lat, long: lng }).then(res => {
        let placeName = res[0].name + ',%20' + res[0].countryCode;
        ToastAndroid.show(`Loading Trends of ${res[0].name}, ${res[0].countryCode}`, ToastAndroid.LONG);
        let geoEndPoint = `https://eu1.locationiq.com/v1/search.php?key=d0ca1e7a07bcba&q=${placeName}&format=json`
        fetch(geoEndPoint).then(res => res.json()).then(response => {
          let tempData = [];
          tempData[0] = response[0];
          for (let i = 1; i < response.lenth; i++) {
            if (response[i].importance > tempData[0].importance)
              tempData[0] = response[i];
          }
          let currentLocation = {
            "west": parseFloat(tempData[0].boundingbox[2]),
            "south": parseFloat(tempData[0].boundingbox[0]),
            "east": parseFloat(tempData[0].boundingbox[3]),
            "north": parseFloat(tempData[0].boundingbox[1]),
            "longitude": parseFloat(tempData[0].lon),
            "latitude": parseFloat(tempData[0].lat)
          };
          const region = regionBuilder(currentLocation.latitude, currentLocation.longitude, currentLocation.north, currentLocation.south)
          let woeid = res[0].woeid;
          this.trendsByPlace(woeid).then(res => {
            let distance = getDistanceFromLatLonInKm(currentLocation.south, currentLocation.west, currentLocation.north, currentLocation.east) * 200;
            let randomGeoPoints = generateRandomPoints({ 'lat': currentLocation.latitude, 'lng': currentLocation.longitude }, distance, res[0].trends.length);
            this.setGlobal({
              region,
              currentLocation
            })
            this.setState({
              trends: res[0].trends,
              randomPoints: randomGeoPoints,
            })
            this.setState({ loading: false })
          })
        })
      });
    }
  }

  trendsByPlace = (woeid) => {
    if (this.global.twitter !== null) {
      const { rest } = twitter(this.global.tokens);
      this.setState({ loading: true })
      return rest.get('trends/place', { id: woeid }).then(res => {
        this.setState({ loading: false })
        return res;
      });
    }
  }

  async componentDidMount() {
    StatusBar.setBackgroundColor('#2874A6', true);
    this.props.navigation.setParams({ openSearchModal: this.openSearchModal })
    this.nearbyTrendyPlace(this.global.currentLocation.latitude, this.global.currentLocation.longitude);
  }

  markerPress(coordinate, item) {
    this.props.navigation.navigate('Browse', { data: item });
  }

  render() {
    return (
      this.state.loading ?
        <Loading />
        :
        <View style={styles.container}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.global.region}>
            {
              this.state.randomPoints.length > 0 && this.state.trends.length > 0 ?
                this.state.randomPoints.map((item, key) => {
                  return (
                    <Marker draggable
                      key={key}
                      coordinate={{ latitude: item.lat, longitude: item.lng }}
                      onPress={(e) => this.markerPress(e, this.state.trends[key])}>
                      <View
                        style={{ backgroundColor: colorSelector(this.state.trends[key].tweet_volume, this.state.trends[key].promoted_content), borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontFamily: 'Pom', fontSize: 22, color: '#283747', padding: 3 }}>{this.state.trends[key].name}</Text>
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
