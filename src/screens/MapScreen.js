import { createStackNavigator, createAppContainer } from 'react-navigation'
import Search from '../Component/SearchPlaces'
import Trending from '../Component/Trending'

const Navigator = createStackNavigator({
    Trending: Trending,
    Search: Search,
})

export default createAppContainer(Navigator);