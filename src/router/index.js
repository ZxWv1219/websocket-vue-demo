import Vue from 'vue'
import Router from 'vue-router'

//懒加载
const Home = () => import('@/views/home/Home')

Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err);
}


export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/home',
      component: Home
    }
  ]
})
