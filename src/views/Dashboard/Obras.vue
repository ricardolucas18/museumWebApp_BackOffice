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
                  <h2>Obras</h2>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Procurar Obra"
                    single-line
                    hide-details
                  ></v-text-field>
                </v-card-title>
                <v-data-table
                  :headers="headers"
                  :items="obras"
                  :search="search"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.Nome }}</td>
                    <td class="text-xs-right">{{ props.item.Data }}</td>
                    <td class="text-xs-right">{{ props.item.Genero }}</td>
                    <td class="text-xs-right">{{ props.item.Tipo }}</td>
                    <td class="text-xs-right">{{ props.item.Referencia }}</td>
                    <td class="justify-center layout px-0">
                      <v-icon
                        small
                        class="mr-2"
                        @click="editarItem(props.item)"
                      >
                        edit
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
                      <v-btn slot="activator" color="success" dark class="mb-2">Adicionar nova obra</v-btn>
                      <v-card>
                        <v-card-title>
                          <span class="headline">Adicionar nova obra</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-text-field label="Título da Obra*" hint="Nome da obra" v-model="nomeObra" required></v-text-field>
                              </v-flex>
                                <v-flex xs12 sm6 md4>
                                  <v-text-field
                                    label="Género*"
                                    hint="Ex: Renascentista, Contemporâneo..."
                                    v-model="generoObra"
                                    required
                                  ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                  <v-text-field label="Data*" hint="Data da obra" v-model="dataObra" required></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm6 md4>
                                  <v-text-field
                                    label="Tipo*"
                                    hint="Ex: Pintura, Escultura..."
                                    v-model="tipoObra"
                                    required
                                  ></v-text-field>
                                </v-flex>
                              <v-flex xs12>
                                <v-textarea
                                  name="input-7-1"
                                  label="Descrição*"
                                  value=""
                                  v-model="descricaoObra"
                                  hint="Descrição sobre a obra"
                                  required
                                ></v-textarea>
                              </v-flex>
                              <v-flex xs12>
                                <v-text-field label="Url video*" v-model="urlObra" hint="" required></v-text-field>
                              </v-flex>
                              <v-flex xs12>
                                <v-btn color="success" dark class="mb-2" @click="onPickImages">Adicionar Imagens</v-btn>
                                <input type="file" style="display: none" ref="imageInput" accept="image/*" @change="onImagePicked" multiple>
                              </v-flex>
                              <v-layout v-for="item in filesImages">
                                <p> {{ item.name }}</p>
                              </v-layout>
                              <v-flex xs12>
                                <v-btn color="success" dark class="mb-2" @click="onPickSom">Adicionar Som</v-btn>
                                <input type="file" style="display: none" ref="somInput" accept="audio/*" @change="onSomPicked">
                              </v-flex>
                              <v-layout v-for="item in filesSom">
                                <p> {{ item.name }}</p>
                              </v-layout>
                            </v-layout>
                          </v-container>
                          <small>*indicates required field</small>
                          <v-progress-linear
                            color="success"
                            height="20"
                            v-model="valueDeterminate"
                          ></v-progress-linear>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialog = false">Fechar</v-btn>
                          <v-btn color="blue darken-1" flat @click="addObra">Adicionar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogEditar" persistent max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="headline">Editar - {{ editarNome }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <v-text-field label="Título da Obra*" hint="Nome da obra" v-model="editarNome"  required></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-text-field
                                  label="Género*"
                                  hint="Ex: Renascentista, Contemporâneo..."
                                  v-model="editarGenero"
                                  required
                                ></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-text-field label="Data*" hint="Data da obra" v-model="editarData" required></v-text-field>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <v-text-field
                                  label="Tipo*"
                                  hint="Ex: Pintura, Escultura..."
                                  v-model="editarTipo"
                                  required
                                ></v-text-field>
                              </v-flex>
                              <v-flex xs12>
                                <v-textarea
                                  name="input-7-1"
                                  label="Descrição*"
                                  value=""
                                  v-model="editarDescricao"
                                  hint="Descrição sobre a obra"
                                  required
                                ></v-textarea>
                              </v-flex>
                              <v-flex xs12>
                                <v-text-field label="Url video*" v-model="editarUrl" hint="" required></v-text-field>
                              </v-flex>
                              <v-flex xs12>
                                <v-btn color="success" dark class="mb-2" @click="onPickImages">Adicionar Imagens</v-btn>
                                <input type="file" style="display: none" ref="imageInput" accept="image/*" @change="onImagePicked" multiple>
                              </v-flex>
                              <v-layout v-for="item in filesImages">
                                <p> {{ item.name }}</p>
                              </v-layout>
                              <v-flex xs12>
                                <v-btn color="success" dark class="mb-2" @click="onPickSom">Adicionar Som</v-btn>
                                <input type="file" style="display: none" ref="somInput" accept="audio/*" @change="onSomPicked">
                              </v-flex>
                              <v-layout v-for="item in filesSom">
                                <p> {{ item.name }}</p>
                              </v-layout>
                            </v-layout>
                          </v-container>
                          <small>*indicates required field</small>
                          <v-progress-linear
                            color="success"
                            height="20"
                            v-model="valueDeterminate"
                          ></v-progress-linear>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialogEditar = false">Fechar</v-btn>
                          <v-btn color="blue darken-1" flat @click="editarObra(editarReferencia)">Confirmar</v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-dialog v-model="dialogRemover" persistent max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="headline">Remover Obra - {{ removerTitulo }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-container grid-list-md>
                            <v-layout wrap>
                              <v-flex xs12>
                                <h3>Informações:</h3>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <label>Género: {{ removerGenero }}</label>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <label>Tipo: {{ removerTipo }}</label>
                              </v-flex>
                              <v-flex xs12 sm6 md4>
                                <label>Data: {{ removerData }}</label>
                              </v-flex>
                              <v-flex xs12>
                                <label>Descrição: {{ removerDescricao }}</label>
                              </v-flex>
                              <v-flex xs12>
                                <label>Referência: {{ removerReferencia }}</label>
                              </v-flex>
                              <v-flex xs12>
                                <h1>Tem a certeza que pretende remover esta obra?</h1>
                              </v-flex>
                            </v-layout>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer></v-spacer>
                          <v-btn color="blue darken-1" flat @click="dialogRemover = false">Não</v-btn>
                          <v-btn color="blue darken-1" flat @click="removeObra(removerReferencia)">Sim</v-btn>
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
import { O2A } from 'object-to-array-convert'

export default {
  data: () => ({
    uploadTask: '',
    valueDeterminate: 0,
    removerTitulo: '',
    removerGenero: '',
    removerTipo: '',
    removerData: '',
    removerDescricao: '',
    removerReferencia: '',
    editarNome: '',
    editarGenero: '',
    editarTipo: '',
    editarData: '',
    editarDescricao: '',
    editarReferencia: '',
    editarUrl: '',
    nomeObra: '',
    generoObra: '',
    dataObra: '',
    tipoObra: '',
    descricaoObra: '',
    urlObra: '',
    dialog: false,
    dialogRemover: false,
    dialogEditar: false,
    search: '',
    sideNav: false,
    headers: [
      {
        text: 'Nome',
        align: 'left',
        sortable: false,
        value: 'Nome'
      },
      { text: 'Data', value: 'data', sortable: false },
      { text: 'Genero', value: 'name', sortable: false },
      { text: 'Tipo', value: 'tipo', sortable: false },
      { text: 'Referência', value: 'referencia', sortable: false },
      { text: 'Ações', value: 'acoes', sortable: false }
    ],
    obras: [],
    fotos: ['fotografia1', 'fotografia2', 'fotografia3', 'fotografia4', 'fotografia5', 'fotografia6', 'fotografia7', 'fotografia8', 'fotografia9', 'fotografia10'],
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
    this.getObras()
  },
  props: {
    source: String
  },
  methods: {
    editarItem (item) {
      this.filesImages = null
      this.filesSom = null
      this.editarNome = item.Nome
      this.editarGenero = item.Genero
      this.editarDescricao = item.Descricao
      this.editarTipo = item.Tipo
      this.editarReferencia = item.Referencia
      this.editarData = item.Data
      this.editarUrl = item.Video

      this.dialogEditar = true
      firebase.database().ref('Obras/' + this.editarReferencia + '/Fotos').on('value', (data) => {
        data.forEach((childSnapshot) => {
          var childData = childSnapshot.val()
          this.filesImagesEditar.push(childData)
        })
      })
      firebase.database().ref('Obras/' + this.editarReferencia + '/Som').on('value', (data) => {
        this.filesSomEditar = data.val()
      })
      console.log(this.filesSomEditar)
      console.log(item.Referencia)
    },
    editarObra (key) {
      // this.dialogEditar = true

      firebase.database().ref('Obras/' + key + '/Nome').set(this.editarNome)
      firebase.database().ref('Obras/' + key + '/Data').set(this.editarData)
      firebase.database().ref('Obras/' + key + '/Descricao').set(this.editarDescricao)
      firebase.database().ref('Obras/' + key + '/Genero').set(this.editarGenero)
      firebase.database().ref('Obras/' + key + '/Tipo').set(this.editarTipo)
      firebase.database().ref('Obras/' + key + '/Video').set(this.editarUrl)
      if (this.filesImages == null) {
        console.log('NÃO FORAM SELECIONADAS IMAGENS')
      } else {
        console.log('FORAM SELECIONADAS IMAGENS')
        for (var i = 0; i < this.filesImagesEditar.length; i++) {
          const filename = this.filesImagesEditar[i]
          firebase.storage().ref('Obras/' + key + '/images/' + filename).delete()
        }
        firebase.database().ref('Obras/' + key + '/Fotos').remove()
        for (var k = 0; k < this.filesImages.length; k++) {
          const filename = this.filesImages[k].name
          firebase.storage().ref('Obras/' + key + '/images/' + filename).put(this.filesImages[k])
          firebase.database().ref('Obras/' + key + '/Fotos/' + this.fotos[k]).set(filename)
        }
      }

      if (this.filesSom == null) {
        console.log('NÃO FOI SELECIONADO UM SOM')
        this.$router.go('dashboard/obras')
      } else {
        const soundName = this.filesSom[0].name
        firebase.storage().ref('Obras/' + key + '/som/' + this.filesSomEditar).delete()
        firebase.database().ref('Obras/' + key + '/Som').remove()
        firebase.database().ref('Obras/' + key + '/Som').set(soundName)
        this.uploadTask = firebase.storage().ref('Obras/' + key + '/som/' + soundName).put(this.filesSom[0])
      }
    },
    addObra: function () {
      let key
      if (this.nomeObra === '' || this.filesSom == null || this.filesImages == null) {
        alert('Oops, preencha o nome da obra e adicione pelo menos um som e uma imagem')
      } else {
        const novaObra = {
          Nome: this.nomeObra,
          Genero: this.generoObra,
          Data: this.dataObra,
          Tipo: this.tipoObra,
          Descricao: this.descricaoObra,
          Video: this.urlObra,
          Fotos: '',
          Som: ''
        }

        firebase.database().ref('Obras').push(novaObra)
          .then((data) => {
            key = data.key
            // console.log(data)
            return key
          })
          .then(key => {
            const soundName = this.filesSom[0].name
            this.uploadTask = firebase.storage().ref('Obras/' + key + '/som/' + soundName).put(this.filesSom[0])
            firebase.database().ref('Obras/' + key + '/Som').set(soundName)
            for (var i = 0; i < this.filesImages.length; i++) {
              const filename = this.filesImages[i].name
			        firebase.database().ref('Obras/' + key + '/Fotos/' + this.fotos[i]).set(filename)
              firebase.storage().ref('Obras/' + key + '/images/' + filename).put(this.filesImages[i])
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
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
      this.filesImagesRemover = []
      this.filesSomRemover = ''
      this.removerTitulo = item.Nome
      this.removerGenero = item.Genero
      this.removerDescricao = item.Descricao
      this.removerTipo = item.Tipo
      this.removerReferencia = item.Referencia
      this.removerData = item.Data
      this.dialogRemover = true

      firebase.database().ref('Obras/' + this.removerReferencia + '/Fotos').on('value', (data) => {
        data.forEach((childSnapshot) => {
          var childData = childSnapshot.val()
          this.filesImagesRemover.push(childData)
        })
      })

      console.log(this.filesImagesRemover)
    },
    removeObra (key) {
      for (var i = 0; i < this.filesImagesRemover.length; i++) {
        const filename = this.filesImagesRemover[i]
        firebase.storage().ref('Obras/' + key + '/images/' + filename).delete()
      }
      firebase.database().ref('Obras/' + this.removerReferencia + '/Som').on('value', (data) => {
        this.filesSomRemover = data.val()
      })

      firebase.storage().ref('Obras/' + key + '/som/' + this.filesSomRemover).delete()
      firebase.database().ref('Obras/' + key).remove().then(function () {
      }).catch(function (error) {
        console.log(error)
      })
      this.$router.go('dashboard/obras')
    }
  },
  watch: {
    uploadTask: function () {
      this.uploadTask.on('state_changed', sp => {
        this.valueDeterminate = Math.floor(sp.bytesTransferred / sp.totalBytes * 100)
      },
      null,
      () => {
        this.$router.go('dashboard/obras')
        // this.getObras()
        // this.dialog = false
      })
    }
  }
}
</script>
