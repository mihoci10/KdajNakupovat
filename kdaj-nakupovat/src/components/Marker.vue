<template>
    <MglMap id = "map"
      :accessToken="accessToken"
      :mapStyle.sync="mapStyle"
      :attributionControl="false"
      @load="onMapLoaded"
      @zoomend="onViewChange"
      @dragend="onViewChange"
      @click="onClick"
    >
      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
    </MglMap>
</template>

<script>
import VisitService from "../VisitService";
import { EventBus } from '../plugins/event-bus';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
} from "vue-mapbox";

export default {
  name: 'Map',
  components: {
      
  },
  data() {
    return {

    };
  },
  created() {
  },
}
</script>
<style scoped>
</style>
