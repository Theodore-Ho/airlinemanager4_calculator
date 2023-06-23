import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedstate from 'vuex-persistedstate';
import Marketing from "@/store/modules/marketing";
import Settings from "@/store/modules/settings";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    Marketing,
    Settings
  },
  plugins: [
    createPersistedstate({
      key: 'AirlineManager4_Calculator',
      paths: ['Marketing', 'Settings']
    })
  ]
})
