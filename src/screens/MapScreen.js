import { createStackNavigator, createAppContainer } from 'react-navigation'
import Browse from '../Component/Browse'
import Trending from '../Component/Trending'

const Navigator = createStackNavigator({
    Trending: Trending,
    Browse: Browse,
})

export default createAppContainer(Navigator);