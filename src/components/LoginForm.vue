<template>
  <v-app id="inspire">
    <v-content>
      <v-toolbar>
        <v-toolbar-title><v-icon>account_balance</v-icon> Museum App - Area de Administração</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items class="hidden-sm-and-down">
        </v-toolbar-items>
      </v-toolbar>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>Autenticação</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field prepend-icon="person" name="login" label="Email" type="text" v-model="email"></v-text-field>
                  <v-text-field id="password" prepend-icon="lock" name="password" label="Palavra-passe" type="password" v-model="password"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" @click="login">Autenticar</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-footer
        dark
        height="auto"
      >
        <v-card
          class="flex"
          flat
          tile
        >
          <v-card-actions class="grey darken-3 justify-center">
            &copy;{{ new Date().getFullYear() }} — <strong>Museum App made by José Morais, Pedro Abílio, Ricardo Lucas</strong>
          </v-card-actions>
        </v-card>
      </v-footer>
    </v-content>
  </v-app>
</template>

<script>
import firebase from 'firebase'

export default {
  name: 'login',
  data: () => ({
    drawer: null,
    email: '',
    password: ''
  }),
  props: {
    source: String
  },
  methods: {
    login: function () {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        (user) => {
          this.$router.replace('dashboard')
        },
        (err) => {
          alert('Oops, ' + err.message)
        }
      )
    }
  }
}
</script>
