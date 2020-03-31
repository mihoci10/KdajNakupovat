<template>
  <v-app>
      <Map/>
       <v-card color="#f7f7f7">
      <Slider/>
    </v-card>
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
<style scoped>
</style>