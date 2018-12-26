import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity, Alert, StatusBar } from 'react-native';
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
        this.placeDataGet(place.address);
      })
      .catch(error => console.log("Error!", error));
  }

  nearbyTrendyPlace = (lat, lng) => {
    if (this.global.twitter !== null) {
      this.setState({ loading: true })
      const { rest } = twitter(this.global.tokens);
      return rest.get('trends/closest', { lat: lat, long: lng }).then(res => {
        let name = res[0].name;
        let endpoint = `https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20geo.places%20where%20text%3D%22${name}%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&formal=json`;
        fetch(endpoint).then(res => res.json()).then(data => {
          console.log("Data: ", data);
          let tempData = [];
          data.query.count == 1 ? tempData.push(data.query.results.place) : tempData.push(data.query.results.place[0]);

          let currentLocation = {
            "west": parseFloat(tempData[0].boundingBox.southWest.longitude),
            "south": parseFloat(tempData[0].boundingBox.southWest.latitude),
            "east": parseFloat(tempData[0].boundingBox.northEast.longitude),
            "north": parseFloat(tempData[0].boundingBox.northEast.latitude),
            "longitude": parseFloat(tempData[0].centroid.longitude),
            "latitude": parseFloat(tempData[0].centroid.latitude)
          };
          const region = regionBuilder(currentLocation.latitude, currentLocation.longitude, currentLocation.north, currentLocation.south)
          let woeid = tempData[0].woeid;
          this.trendsByPlace(woeid).then(res => {
            let distance = getDistanceFromLatLonInKm(currentLocation.south, currentLocation.west, currentLocation.north, currentLocation.east) * 200;
            let randomGeoPoints = generateRandomPoints({ 'lat': currentLocation.latitude, 'lng': currentLocation.longitude }, distance, res[0].trends.length);
            this.setGlobal({
              region,
              currentLocation
            })
            console.log("Trends: ", res[0].trends)
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

  placeDataGet = (place) => {
    this.setState({ loading: true })
    let endpoint = `https://query.yahooapis.com/v1/public/yql?q=select%20woeid%20from%20geo.places%20where%20text%3D%22${place}%22&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&formal=json`;
    fetch(endpoint).then(response => response.json()).then(data => {
      let tempData = [];
      data.query.count == 1 ? tempData.push(data.query.results.place) : tempData.push(data.query.results.place[0]);
      let result = tempData[0];
      this.trendsByPlace(result.woeid).then(res => {
        let distance = getDistanceFromLatLonInKm(this.global.currentLocation.south, this.global.currentLocation.west, this.global.currentLocation.north, this.global.currentLocation.east) * 200;
        let randomGeoPoints = generateRandomPoints({ 'lat': this.global.currentLocation.latitude, 'lng': this.global.currentLocation.longitude }, distance, res[0].trends.length);
        console.log("Trends: ", res[0].trends)
        this.setState({
          trends: res[0].trends,
          randomPoints: randomGeoPoints
        })
      }).catch(err => {
        Alert.alert('Sorry!',
          "No TrendyTags Available at Your Location",
          [
            { text: 'Nearby Trends', onPress: () => { this.nearbyTrendyPlace(this.global.currentLocation.latitude, this.global.currentLocation.longitude) } },
            { text: 'Change Location', onPress: () => { this.openSearchModal() } },
            { text: 'Cancel', onPress: () => null }
          ]
        );
        console.log("No trends near location:", err);
      })
      const region = regionBuilder(this.global.currentLocation.latitude, this.global.currentLocation.longitude, this.global.currentLocation.north, this.global.currentLocation.south)
      this.setGlobal({
        region: region
      })
      this.setState({ loading: false })
    }).catch(error => console.log("Error!", error));
  }

  async componentDidMount() {
    StatusBar.setBackgroundColor('#2874A6', true);
    this.props.navigation.setParams({ openSearchModal: this.openSearchModal })
    this.placeDataGet(this.global.placeName)
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
