<template>
  <div>
    <Select2 :options="aircraft_options" v-model="selected" style="width: 100%">
      <option disabled value="0">Select one</option>
    </Select2>
  </div>
</template>

<script>
import Select2 from "@/components/Select2.vue";
import AircraftData from "@/assets/data/aircraft.json";

export default {
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
