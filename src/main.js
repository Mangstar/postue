import Vue from 'vue';
import {
  Header,
  Main,
  Footer,
  Container,
  Row,
  Col,
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

Vue.use(Header);
Vue.use(Main);
Vue.use(Footer);
Vue.use(Container);
Vue.use(Row);
Vue.use(Col);
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
  render: h => h(App)
}).$mount('#app');
