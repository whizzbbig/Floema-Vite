import '../styles/index.scss';

import Cursor from './components/Cursor';

import AboutScene from './scenes/About';
import HomeScene from './scenes/Home';
import LothusScene from './scenes/Lothus';

import AboutPage from './pages/About';
import HomePage from './pages/Home';
import LothusPage from './pages/Lothus';

import Application from './classes/App';

const App = new Application();

const components = [
  {
    component: Cursor,
  },
];

App.initComponents(components);

const routes = [
  {
    component: HomePage,
    scene: HomeScene,
    template: 'home',
  },
  {
    component: AboutPage,
    scene: AboutScene,
    template: 'about',
  },
  {
    component: LothusPage,
    scene: LothusScene,
    template: 'lothus',
  },
];

App.initRoutes(routes);
App.init();

window.App = App;
