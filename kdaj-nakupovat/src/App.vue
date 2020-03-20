<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <h1 class="">Kdaj Nakupovat</h1>
      </div>
      <v-spacer></v-spacer>
        <v-btn
              color="error"
              @click="addMarker">
          Dodaj
        </v-btn>
    </v-app-bar>
    <v-content>
      <Map/>
      <v-bottom-sheet content-class="elevation-0" :persistent="true" value=true :hide-overlay="true">
        <Slider/>
      </v-bottom-sheet>
    </v-content>
  </v-app>
</template>

<script>
import Map from './components/Map';
import Slider from './components/Slider';
import { EventBus } from './plugins/event-bus';

export default {
  name: 'App',

  components: {
    Map,
    Slider,
  },

  data: () => ({
    
  }),
  methods: {
    addMarker(){
      EventBus.$emit('addMarker')
    }
  },
};
</script>
<style>
</style>