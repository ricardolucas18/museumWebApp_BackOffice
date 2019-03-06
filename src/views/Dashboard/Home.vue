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
            <div>
              <div class="text-md-center">
                <img src="../../25730.png">
              </div>
              <v-card>
                <v-container grid-list-md>
                  <v-layout wrap>
                    <v-flex xs12>
                      <h3>Verificar Uso:</h3>
                      <div class="text-md-center">
                        <v-btn color="info" onclick="window.open('https://console.firebase.google.com/u/0/project/projetointegrado-museum/database/usage/current-billing/connections')" >Database</v-btn>
                        <v-btn color="info" onclick="window.open('https://console.firebase.google.com/u/0/project/projetointegrado-museum/storage/usage/current-billing/total_bytes')" >Storage</v-btn>
                        <v-btn color="info" onclick="window.open('https://console.firebase.google.com/u/0/project/projetointegrado-museum/authentication/usage/current-billing')" >Auth</v-btn>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card>
            </div>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
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
  }
}
</script>
