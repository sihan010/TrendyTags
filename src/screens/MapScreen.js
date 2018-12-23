import { createStackNavigator, createAppContainer } from 'react-navigation'
import Search from '../Component/SearchPlaces'
import Trending from '../Component/Trending'

const Navigator = createStackNavigator({
    Search: Search,
    Trending: Trending,
})

export default createAppContainer(Navigator);