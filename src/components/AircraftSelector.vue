<template>
  <div>
    <Select2 :options="aircraft_options" v-model="selected" style="width: 100%"></Select2>
  </div>
</template>

<script>
import Select2 from "@/components/Select2.vue";
import AircraftData from "@/assets/data/aircraft.json";

export default {
  props: ["aircraft_selected"],
  components: {
    Select2
  },
  created() {
    AircraftData.data.forEach( item => {
      this.aircraft_options.push({id: item.name, text: item.name});
    })
  },
  watch: {
    selected(val) {
      this.$emit('getSelectedAircraft', val);
    },
    aircraft_selected(val) {
      if(val !== 'find') {
        this.selected = val;
      }
    }
  },
  data() {
    return {
      selected: "find",
      aircraft_options: [
        { id: "find", text: "Help me find a best aircraft" }
      ],
    };
  },
};
</script>

<style>
html,
body {
  font: 13px/18px sans-serif;
}
</style>
