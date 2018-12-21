import React, { Component } from 'reactn';
import { StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import RNGooglePlaces from 'react-native-google-places';

class SearchPlaces extends Component {
  openSearchModal() {
    RNGooglePlaces.openAutocompleteModal()
    .then((place) => {
		  console.log(place);
		// place represents user's selection from the
		// suggestions and it is a simplified Google Place object.
    })
    .catch(error => console.log(error.message));  // error is a Javascript Error object
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => this.openSearchModal()}>
          <Text>Pick a Place</Text>
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
