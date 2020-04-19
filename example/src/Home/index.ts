import { createPage } from '../../../page/index'
import store from './Model'
import View from './View'

const Home = createPage(View, store)

export default Home