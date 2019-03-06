<template>
  <v-app id="inspire">
    <v-navigation-drawer fixed v-model="sideNav" left clipped app>
      <v-list dense>
        <v-list-tile v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed app clipped-right>
      <v-toolbar-side-icon @click.stop="sideNav = !sideNav"></v-toolbar-side-icon>
      <v-toolbar-title><v-icon>account_balance</v-icon> Museum App - Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-content>
      <v-container fluid fill-height>
        <v-layout>
          <v-flex xs12 sm6 offset-sm3>
            <v-card>

              <v-card-title class="justify-center" primary-title>
                <div>
                  <h3 class="headline mb-0" display-4>Têm a certeza que pretende terminar a sessão?</h3>
                </div>
              </v-card-title>

              <v-card-actions class="justify-center">
                <v-btn color="error" @click="logout">Sim</v-btn>
                <v-btn color="info" to="/dashboard">Não</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>

import firebase from 'firebase'

export default {
  data: () => ({
    sideNav: false,
    menuItems: [
      { icon: 'home', title: 'Dashboard', link: '/dashboard' },
      { icon: 'timeline', title: 'Gerir caminhos', link: '/dashboard/caminhos' },
      { icon: 'turned_in', title: 'Gerir Obras', link: '/dashboard/obras' },
      { icon: 'exit_to_app', title: 'Terminar Sessão', link: '/dashboard/logout' }
    ]
  }),
  props: {
    source: String
  },
  methods: {
    logout: function () {
      firebase.auth().signOut().then(() => {
        this.$router.go('login')
      })
    }
  }
}
</script>
