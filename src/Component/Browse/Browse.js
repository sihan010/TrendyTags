import React, { Component } from 'reactn';
import { StyleSheet, View, WebView, StatusBar } from 'react-native';

class Browse extends Component {
  constructor(props) {
    super(props);
  } 

  componentDidMount(){
    StatusBar.setBackgroundColor('#2874A6', true);
  }

  static navigationOptions = ({ navigation }) => {
    let data = navigation.getParam('data');
    return {
      title: data.name,
      headerStyle: {
        backgroundColor: '#2874A6',
      },
      headerTintColor: '#D6EAF8',
      headerTitleStyle: {
        flex: 1,
        textAlign: 'center',
        fontFamily: 'Pom',
        fontWeight: '200',
        marginLeft:-40
      }
    }
  };

  render() {
    let data = this.props.navigation.getParam('data');
    return (
      <View style={styles.container}>
        <WebView source={{uri:data.url}}/>
      </View>
    );
  }
}

export default Browse;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
