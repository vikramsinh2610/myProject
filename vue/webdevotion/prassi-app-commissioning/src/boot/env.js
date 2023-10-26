import env from './env/env';

export default ({ Vue }) => {
  Vue.prototype.$env = env;
};
