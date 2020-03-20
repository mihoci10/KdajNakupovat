<template>
    <v-container class=white>
        <p class="text-center display-1 font-weight-bold">{{formatTime(currVal)}}</p>
        <v-slider
            :value="currVal"
            :min="minVal"
            :max="maxVal"
            :step="60*60*1000"
            @change="changeVal"
        >
        </v-slider>
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
            minVal: Math.round((new Date().getTime()) / (60*60*1000) * (60*60*1000)),
            maxVal: Math.round((new Date().getTime() + (5*24*60*60*1000)) / (60*60*1000)) * (60*60*1000),
            currVal: Math.round((new Date().getTime()) / (60*60*1000) * (60*60*1000)),
      };
  },
  methods:{
      changeVal(val){
            this.currVal = val;
            EventBus.$emit('timeChange', new Date(this.currVal));
            console.log(val);
      },
      formatTime(time){
          time = new Date(time);
          return `${time.getHours().pad(2)}:${time.getMinutes().pad(2)} ${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}`
      }
  }
  }
  </script>
<style scoped>

</style>