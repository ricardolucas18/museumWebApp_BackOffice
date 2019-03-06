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
              <v-card>
                <v-card-title class="font-weight-bold">
                  <h2>Caminhos</h2>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Procurar Caminho"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="caminhos"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.Nome }}</td>
                    <td class="text-xs-right">{{ props.item.Tipo }}</td>
                    <td class="text-xs-right">{{ props.item.Referencia }}</td>
                    <td class="justify-center layout px-0">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editarItem(props.item)"
                      >
                        assignment
                      </v-icon>
                      <v-icon
                        small
                        class="mr-2"
                        @click="addLigacao(props.item)"
                      >
                        add_circle
                      </v-icon>
                      <v-icon
                        small
                        @click="deleteItem(props.item)"
                      >
                        delete
                      </v-icon>
                    </td>
                  </template>
                  <v-alert slot="no-results" :value="true" color="error" icon="warning">
                    Your search for "{{ search }}" found no results.
                  </v-alert>
                </v-data-table>
                <div class="text-xs-center pt-2">
                  <v-layout row justify-center>
                    <v-dialog v-model="dialog" persistent max-width="600px">
                      <v-btn slot="activator" color="success" dark class="mb-2">Adicionar novo caminho</v-btn>
                      <v-card>
                        <v-card-title>
                          <span class="headline">Adicionar novo caminho</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-text-field label="Nome do caminho*" hint="Nome do Caminho" v-model="nomeCaminho" required></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-text-field
                                  label="Tipo*"
                                  hint="Ex: Pintura, Escultura..."
                                  v-model="tipoCaminho"
                                  required
                                ></v-text-field>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialog = false">Fechar</v-btn>
                          <v-btn color="blue darken-1" flat @click="addCaminho">Adicionar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogLigacao" persistent max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="headline">Adicionar Ligação - {{ nomeCaminho }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-text-field label="Ordem*" hint="Ordem da ligação" v-model="ordemLigacao" required></v-text-field>
                              </v-flex>
                              <v-flex xs12>
                                <h3>Primera Obra:</h3>
                                <v-flex xs12 sm6 d-flex>
                                  <v-select
                                    :items="obras"
                                    name="category"
                                    label="Selecione uma obra"
                                    v-model="primeiraObra"
                                    item-text="Nome"
                                  ></v-select>
                                  </v-flex>
                              </v-flex>
                              <v-flex xs12>
                                <h3>Segunda Obra:</h3>
                                <v-flex xs12 sm6 d-flex>
                                  <v-select
                                    :items="obras"
                                    name="category"
                                    label="Selecione uma obra"
                                    v-model="segundaObra"
                                    item-text="Nome"
                                  ></v-select>
                                </v-flex>
                              </v-flex>
                              <v-flex xs12>
                                <v-btn color="success" dark class="mb-2" @click="onPickImages">Adicionar Mapa</v-btn>
                                <input type="file" style="display: none" ref="imageInput" accept="image/*" @change="onImagePicked">
                              </v-flex>
                              <v-layout v-for="item in filesImages">
                                <p> {{ item.name }}</p>
                              </v-layout>
                            </v-layout>
                          </v-container>
                          <small>*indicates required field</small>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialogLigacao = false">Fechar</v-btn>
                          <v-btn color="blue darken-1" flat @click="adicionarLigacao(referenciaCaminho)">Confirmar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogRemover" persistent max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="headline">Remover Caminho - {{ removerTitulo }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <h3>Informações:</h3>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <label>Tipo: {{ removerTipo }}</label>
                              </v-flex>
                              <v-flex xs12>
                                <label>Referência: {{ removerReferencia }}</label>
                              </v-flex>
                              <v-flex xs12>
                                <h1>Tem a certeza que pretende remover este caminho?</h1>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialogRemover = false">Não</v-btn>
                          <v-btn color="blue darken-1" flat @click="removeCaminho(removerReferencia)">Sim</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                  </v-layout>
                </div>
              </v-card>
            </div>
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
    ordemLigacao: '',
    primeiraObra: '',
    segundaObra: '',
    nomeCaminho: '',
    referenciaCaminho: '',
    uploadTask: '',
    valueDeterminate: 0,
    removerTitulo: '',
    removerTipo: '',
    removerReferencia: '',
    editarNome: '',
    editarTipo: '',
    editarReferencia: '',
    tipoCaminho: '',
    dialog: false,
    dialogRemover: false,
    dialogLigacao: false,
    search: '',
    sideNav: false,
    headers: [
      {
        text: 'Nome',
        align: 'left',
        sortable: false,
        value: 'Nome'
      },
      { text: 'Tipo', value: 'tipo', sortable: false },
      { text: 'Referência', value: 'referencia', sortable: false },
      { text: 'Ações', value: 'acoes', sortable: false }
    ],
    caminhos: [],
    obras: [],
    fotos: ['fotografia1', 'fotografia2', 'fotografia3'],
    menuItems: [
      { icon: 'home', title: 'Dashboard', link: '/dashboard' },
      { icon: 'timeline', title: 'Gerir caminhos', link: '/dashboard/caminhos' },
      { icon: 'turned_in', title: 'Gerir Obras', link: '/dashboard/obras' },
      { icon: 'exit_to_app', title: 'Terminar Sessão', link: '/dashboard/logout' }
    ],
    filesImages: null,
    filesSom: null,
    filesImagesRemover: [],
    filesSomRemover: '',
    filesImagesEditar: [],
    filesSomEditar: ''
  }),
  created: function () {
    this.obras = []
    this.caminhos = []
    this.getCaminhos()
    this.getObras()
  },
  props: {
    source: String
  },
  methods: {
    addLigacao (item) {
      this.nomeCaminho = item.Nome
      this.referenciaCaminho = item.Referencia
      this.primeiraObra = null
      this.segundaObra = null
      this.filesImages = null
      this.ordemLigacao = null
      console.log(this.nomeCaminho + ' ' + this.referenciaCaminho)
      this.dialogLigacao = true
    },
    adicionarLigacao (item) {
      firebase.database().ref('Obras').on('value', (data) => {
        data.forEach((childSnapshot) => {
          var childData = childSnapshot.val()
          var key = childSnapshot.key
          var nome = childData.Nome

          if (nome === this.primeiraObra) {
            this.primeiraObra = key
          } else if (nome === this.segundaObra) {
            this.segundaObra = key
          }
        })
      })
      const novaLigacao = {
        Refinicio: this.primeiraObra,
        Reffim: this.segundaObra,
        Mapa: this.filesImages[0].name,
        Ordem: this.ordemLigacao

      }

      firebase.database().ref('Caminhos/' + item + '/Ligacoes').push(novaLigacao)
        .then((data) => {
          this.uploadTask = firebase.storage().ref('Caminhos/' + item + '/' + data.key + '/mapa/' + this.filesImages[0].name).put(this.filesImages[0])
        })
    },
    addCaminho: function () {
      let key
      if (this.nomeCaminho === '') {
        alert('Oops, preencha o nome do caminho')
      } else {
        const novoCaminho = {
          Nome: this.nomeCaminho,
          Tipo: this.tipoCaminho
        }

        firebase.database().ref('Caminhos').push(novoCaminho)
          .then((data) => {
            key = data.key
            // console.log(data)
            return key
          })
        this.$router.go('dashboard/caminhos')
      }
    },
    getCaminhos: function () {
      firebase.database().ref('Caminhos').on('value', (data) => {
        data.forEach((childSnapshot) => {
          var childData = childSnapshot.val()
          var nome = childData.Nome
          var tipo = childData.Tipo
          var key = childSnapshot.key

          const caminho = {
            Nome: nome,
            Tipo: tipo,
            Referencia: key
          }

          this.caminhos.push(caminho)
        })
      })
    },
    getObras: function () {
      firebase.database().ref('Obras').on('value', (data) => {
        data.forEach((childSnapshot) => {
          var childData = childSnapshot.val()
          var nome = childData.Nome
          var data = childData.Data
          var genero = childData.Genero
          var tipo = childData.Tipo
          var key = childSnapshot.key
          var descricao = childData.Descricao
          var url = childData.Video

          const obra = {
            Nome: nome,
            Data: data,
            Genero: genero,
            Descricao: descricao,
            Tipo: tipo,
            Referencia: key,
            Video: url
          }

          this.obras.push(obra)
        })
      })
    },
    onPickImages () {
      this.$refs.imageInput.click()
    },
    onImagePicked (event) {
      this.filesImages = []
      const files = event.target.files

      this.filesImages = files
    },
    onPickSom () {
      this.$refs.somInput.click()
    },
    onSomPicked (event) {
      this.filesSom = []
      const files = event.target.files
      this.filesSom = files
    },
    deleteItem (item) {
      this.removerTitulo = item.Nome
      this.removerTipo = item.Tipo
      this.removerReferencia = item.Referencia
      this.dialogRemover = true
    },
    removeCaminho (key) {
      firebase.database().ref('Caminhos/' + key).remove().then(function () {
      }).catch(function (error) {
        console.log(error)
      })
      this.$router.go('dashboard/caminhos')
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.valueDeterminate = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      },
      null,
      () => {
        this.$router.go('dashboard/caminhos')
        // this.getObras()
        // this.dialog = false
      })
    }
  }
}
</script>
