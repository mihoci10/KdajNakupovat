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

    <v-dialog v-model="popup" width="50%">
      <v-card tile color="#f7f7f7">
        <v-card-title
          class="headline lighten-2"
          primary-title
        >
          Pozor
        </v-card-title>

        <v-card-text>
         Za to lokacijo ob istem času že obstaja vnos v podatkovni bazi.
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="#44a089"
            text
            @click="popup = false"
          >
            Potrdi
          </v-btn>
        </v-card-actions>
      </v-card>
      
    </v-dialog>

      <MglNavigationControl position="top-right" />
      <MglGeolocateControl position="top-right" />
      <MglMarker v-if="markerCoords != null" :coordinates="markerCoords" :draggable="true" @dragend="markerDrag">
        <MglPopup :closeButton="false" :closeOnClick="false" :showed="true">
          <v-container>
            <v-row justify="center">
            <p class="subtitle-2">Obisk ob: {{formatTime(queryTime)}}</p>
            </v-row>
            <v-row justify="center">
              <v-btn 
                class="white--text"
                color="#44a089"
                @click="addVisit">
                Dodaj
            </v-btn>
            </v-row>
            <br>
            <v-row justify="center">
            <v-btn
              class="white--text"
              color="#c44b4b"
              @click="removeMarker">
              Preklic
            </v-btn>
            </v-row>
          </v-container>
        </MglPopup>
      </MglMarker>
    </MglMap>
</template>

<script>
import VisitService from "../VisitService";
import { EventBus } from '../plugins/event-bus';
import {
  MglMap,
  MglNavigationControl,
  MglGeolocateControl,
  MglMarker,
  MglPopup
} from "vue-mapbox";

export default {
  name: 'Map',
  components: {
    MglMap,
    MglNavigationControl,
    MglGeolocateControl,
    MglMarker,
    MglPopup
  },
  data() {
    return {
      accessToken: "pk.eyJ1IjoibWlob2NpMTAiLCJhIjoiY2s3eHBucmhtMDF2azNnbzN1M3dhOXhocCJ9.T6R90JQ-VevNRb1yo7pt0A",
      mapStyle: "mapbox://styles/mihoci10/ck7xqar6t01cc1imfzb6gnqib",
      markerCoords: null,
      visitsGeoJSON: null,
      queryTime: new Date(Math.round((new Date().getTime()) / (60*60*1000)) * (60*60*1000)),
      popup: false,
    };
  },
  created() {
    this.map = null;
    EventBus.$on('timeChange', time => {
      this.queryTime = time;
      this.updateVisits();
    });
    EventBus.$on('addMarker',() => {
      this.markerCoords = [this.map.getCenter().lng,this.map.getCenter().lat];
      this.addMarker();
    });
  },
  methods: {
    alert(){
      this.popup = true;
    },
    onMapLoaded(event) {
      this.map = event.map;
      this.map.addSource('visits', {
        type: 'geojson',
        data: this.visitsGeoJSON,
        cluster: true,
      });
      this.map.on('click','clusters', this.zoomCluster);
      this.map.getCanvas().style.cursor = 'default';
      this.map.on('mouseenter', 'poi-label', () => {this.map.getCanvas().style.cursor = 'pointer'});
      this.map.on('mouseleave', 'poi-label', () => {this.map.getCanvas().style.cursor = 'default'});
      this.map.on('click', 'poi-label', this.clickPOI);
      this.map.on('mousedown', () => {this.map.getCanvas().style.cursor = 'grab'});
      this.map.on('mouseup', () => {this.map.getCanvas().style.cursor = 'default'});
      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'visits',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#11b4da', 5, '#dada11', 10, '#da8a11', 15, '#eb4034'],
          'circle-radius': 35,
          'circle-opacity': 0.1,
          'circle-stroke-opacity': 0.7,
          'circle-stroke-width': 3,
          'circle-stroke-color': ['step', ['get', 'point_count'], '#11a8da', 5, '#dab911', 10, '#da7511', 15, '#eb4034'],
        }
      });
      this.map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'visits',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 18
        }
      });
      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'visits',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 35,
          'circle-opacity': 0.1,
          'circle-stroke-opacity': 0.5,
          'circle-stroke-width': 3,
          'circle-stroke-color': '#11a8da',
        }
      });
      this.updateVisits();
    },
    onViewChange(){
      this.updateVisits();
    },
    onClick(){
    },
    addMarker(){
      this.$forceUpdate(); 
    },
    markerDrag(e){
      this.markerCoords = [e.marker._lngLat.lng,e.marker._lngLat.lat];
    },
    async addVisit(){
      var endTime = new Date(this.queryTime.getTime() + (1000*60*60));
      this.visit = await VisitService.createVisit(this.markerCoords,this.queryTime,endTime, this.visits);
      if(this.visit == false)
        this.alert();
      this.markerCoords = null;
      this.$forceUpdate(); 
      this.updateVisits();
    },
    removeMarker(){
      this.markerCoords = null;
      this.$forceUpdate(); 
    },
    async updateVisits(){
        this.visits = await VisitService.getVisits(this.queryTime);
        this.visitsGeoJSON = {
          type: "FeatureCollection",
          features: this.visits.map(visit => {
            return({
              "type": "Feature",
              "properties": {},
              "geometry": {
                "type": "Point",
                "coordinates": 
                  visit.visitLocation
              }
            })
          })
        }
        this.map.getSource('visits').setData(this.visitsGeoJSON);
    },
    zoomCluster(e){
      var features = this.map.queryRenderedFeatures(e.point,{layers: ['clusters']});
      var clusterId = features[0].properties.cluster_id;
      this.map.getSource('visits').getClusterExpansionZoom(
        clusterId,
        (err, zoom) => {
          if(err) return;
          this.map.flyTo({
            center: features[0].geometry.coordinates,
            zoom: zoom,
            speed: 2,
          });
        }
      );
    },
    clickPOI(poi){
      var features = this.map.queryRenderedFeatures(
        poi.point,
        { layers: ['poi-label'] }
      );
      
      var feature = features[0];
      console.log(feature);
      this.markerCoords = feature.geometry.coordinates;
      this.addMarker();
      this.map.flyTo({center: this.markerCoords, zoom:18, speed: 1});      

    },
    formatTime(time){
        time = new Date(time);
        return `${time.getHours().pad(2)}:${time.getMinutes().pad(2)} ${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}`
    }
  },
};
</script>
<style scoped>
</style>
