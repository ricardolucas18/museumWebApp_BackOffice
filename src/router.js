import Vue from 'vue'
import firebase from 'firebase'
import Router from 'vue-router'
import Login from './views/Login.vue'
import Home from './views/Dashboard/Home.vue'
import Logout from './views/Dashboard/LogOut.vue'
import Obras from './views/Dashboard/Obras.vue'
import Caminhos from './views/Dashboard/Caminhos.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Home,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/logout',
      name: 'logout',
      component: Logout,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/obras',
      name: 'obras',
      component: Obras,
      meta: {
        requiresAuth: true
      }
    },
    {
      path: '/dashboard/caminhos',
      name: 'caminhos',
      component: Caminhos,
      meta: {
        requiresAuth: true
      }
    }
  ]
})

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !currentUser) next('login')
  else if (!requiresAuth && currentUser) next('dashboard')
  else next()
})

export default router
