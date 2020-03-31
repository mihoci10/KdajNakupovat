<template>
    <v-container>
    <div>
        <p class="text-center display-1 font-weight-bold">{{formatTime(currVal)}}</p>
        
        <vue-slider @change="changeVal" :tooltip="'none'" v-model="currVal" :min="minVal" :max="maxVal" :interval="60*1000*60" :contained="true" :marks="marks"> </vue-slider>
        <br>
    </div>
    </v-container>
</template>

<script>
Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}
import { EventBus } from '../plugins/event-bus';
export default {
  name: 'Map',
  components: {

  },
  data() {
      return{
            minVal: Math.round((new Date().getTime()) / (60*60*1000)) * (60*60*1000),
            maxVal: Math.round((new Date().getTime() + (5*24*60*60*1000)) / (60*60*1000)) * (60*60*1000),
            currVal: Math.round((new Date().getTime()) / (60*60*1000)) * (60*60*1000),
      };
  },
  methods:{
      changeVal(){
            EventBus.$emit('timeChange', new Date(this.currVal));
      },
      formatTime(time){
          time = new Date(time);
          return `${time.getHours().pad(2)}:${time.getMinutes().pad(2)} ${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}`
      },
      formatShortTime(time){
          time = new Date(time);
          return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}`
      },
      marks(val){
          if((val + 60*60*1000) % (24*60*60*1000) === 0){
              return {label: this.formatShortTime(val)};
          }
          return false;
      }
  }
  }
  </script>
<style scoped>
.wd{
    width:100%;
}
</style>