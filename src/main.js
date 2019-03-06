import Vue from 'vue'
import './plugins/vuetify'
import firebase from 'firebase'
import App from './App.vue'
import router from './router'
import VueFire from 'vuefire'

Vue.config.productionTip = false

let app = ''

Vue.use(VueFire)

// Initialize Firebase
/*
var config = {
  apiKey: 'AIzaSyAF7JmrkmRXJFeMkzrnnn27go-X0-OLUR4',
  authDomain: 'museumappteste.firebaseapp.com',
  databaseURL: 'https://museumappteste.firebaseio.com',
  projectId: 'museumappteste',
  storageBucket: 'museumappteste.appspot.com',
  messagingSenderId: '490671964944'
}
*/

var config = {
  apiKey: "AIzaSyCk9YEsdUp_2MKT3tkcP-2iM7G64O9o_vk",
  authDomain: "projetointegrado-museum.firebaseapp.com",
  databaseURL: "https://projetointegrado-museum.firebaseio.com",
  projectId: "projetointegrado-museum",
  storageBucket: "projetointegrado-museum.appspot.com",
  messagingSenderId: "925185699929"
}

firebase.initializeApp(config)

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  }
})

export const db = firebase.firestore()
