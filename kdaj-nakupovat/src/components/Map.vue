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
      <MglMarker v-if="markerCoords != null" :coordinates="markerCoords" :draggable="true" @dragend="markerDrag">
        <MglPopup :closeButton="false" :closeOnClick="false" :showed="true">
          <div>
            <div>
              <v-btn
                color="success"
                @click="addVisit">
                Dodaj
            </v-btn>
          </div>
          <div>
            <v-btn
              color="error"
              @click="removeMarker">
              Preklic
            </v-btn>
          </div>
          </div>
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
      queryTime: new Date(),
    };
  },
  created() {
    this.map = null;
    EventBus.$on('timeChange', time => {
      this.queryTime = time;
      this.updateVisits();
    });
    EventBus.$on('addMarker',() => {
      this.addMarker();
    });
  },
  methods: {
    onMapLoaded(event) {
      this.map = event.map;
      this.map.addSource('visits', {
        type: 'geojson',
        data: this.visitsGeoJSON,
        cluster: true,
      });
      this.map.on('click','clusters', this.zoomCluster);
      this.map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'visits',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': ['step', ['get', 'point_count'], '#11b4da', 5, '#dada11', 10, '#da8a11', 15, '#da2211'],
          'circle-radius': 20,
          'circle-opacity': 0.5,
          'circle-stroke-width': 3,
          'circle-stroke-color': ['step', ['get', 'point_count'], '#11a8da', 5, '#dab911', 10, '#da7511', 15, '#ad0e0e'],
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
          'text-size': 12
        }
      });
      this.map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'visits',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 20,
          'circle-opacity': 0.5,
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
      this.markerCoords = [this.map.getCenter().lng,this.map.getCenter().lat];
      this.$forceUpdate(); 
    },
    markerDrag(e){
      this.markerCoords = [e.marker._lngLat.lng,e.marker._lngLat.lat];
    },
    async addVisit(){
      var endTime = new Date(this.queryTime.getTime() + 600*60000);
      this.visit = await VisitService.createVisit('kn_user',this.markerCoords,this.queryTime,endTime);
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
    }
  },
};
</script>
<style scoped>
</style>
