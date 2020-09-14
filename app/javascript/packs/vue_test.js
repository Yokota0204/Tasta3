import Vue from 'vue/dist/vue.esm'

window.axios = require('axios');

document.addEventListener('DOMContentLoaded', () => {
  new Vue ({
    el: '#app',
    components: {
      //
    },
    mounted: function () {

      axios.get('/api/tags/1')
        .then(response => {
          this.title = response.data.title,
          this.status = response.data.status,
          this.array = response.data.array
        });

    },
    data: {
      title: '',
      status: 0,
      array: []
    }
  })
})