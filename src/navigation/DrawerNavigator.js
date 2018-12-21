import { createDrawerNavigator, createAppContainer } from 'react-navigation'
import MapScreen from '../screens/MapScreen'

const Navigator = createDrawerNavigator({
    TrendyTweets: MapScreen
})

export default createAppContainer(Navigator);