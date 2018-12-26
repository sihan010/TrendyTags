import { createStackNavigator, createAppContainer } from 'react-navigation'
import Browse from '../Component/Browse'
import Trending from '../Component/Trending'
import Login from '../Component/Login'

const Navigator = createStackNavigator({
    Login:Login,
    Trending: Trending,
    Browse: Browse,
})

export default createAppContainer(Navigator);