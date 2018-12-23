import { createDrawerNavigator, createAppContainer} from 'react-navigation'
import MapScreen from '../screens/MapScreen'
import {Dimensions} from 'react-native'
//const width = Dimensions.get('screen').width;

const Navigator = createDrawerNavigator({
    TrendyTweets: MapScreen
},
{
    //drawerWidth:width
})

export default createAppContainer(Navigator);