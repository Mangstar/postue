import Vue from 'vue';
import {
  Header,
  Main,
  Footer,
  Container,
  Row,
  Col,
  Menu,
  MenuItem,
  Card,
  Loading,
  Input,
  Select,
  Option,
  Popover,
  Dialog,
  Tag,
  Button
} from 'element-ui';
import App from './App.vue';
import store from './store';

// styles
import 'element-ui/lib/theme-chalk/index.css';
import './assets/scss/common.scss';
import router from './router';

Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Container);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Card);
Vue.use(Loading);
Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(Popover);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Button);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app');
