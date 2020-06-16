import { createPage } from '../../../src/page/index'
import store from './Model'
import View from './View'

const About = createPage(View, store)

export default About