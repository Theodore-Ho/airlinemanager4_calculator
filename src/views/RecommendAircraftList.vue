<template>
  <div>
    <vue-good-table
        :columns="columns"
        :rows="aircraft_data"
        :line-numbers="true"
        :sort-options="{
          enabled: true,
          initialSortBy: {field: 'flight_net', type: 'desc'}
        }"
        :pagination-options="{
          enabled: true,
          mode: 'records',
          prevLabel: 'Prev',
          perPageDropdownEnabled: false
        }"
        :search-options="{
          enabled: true
        }"
        compactMode>
      <div slot="emptystate">
        No aircraft available.
      </div>
    </vue-good-table>
  </div>
</template>

<script>
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
  props: ["aircraft_data"],
  components: {
    VueGoodTable
  },
  data() {
    return {
      columns: [
        { label: 'Image', field: 'img', sortable: false, html: true },
        { label: 'Aircraft', field: 'name', sortable: true },
        { label: 'Price', field: 'price', sortable: true, type: 'number', formatFn: this.formatMoney },
        { label: 'Daily Flights', field: 'flight_times', sortable: true, type: 'number' },
        { label: 'Gross Profit', field: 'flight_gross', sortable: true, type: 'number', formatFn: this.formatMoney },
        { label: 'Net Profit', field: 'flight_net', sortable: true, type: 'number', formatFn: this.formatMoney },
        { label: 'Payback Cycle', field: 'payback_cycle', sortable: true, type: 'number', formatFn: this.formatDays }
      ]
    }
  },
  methods: {
    formatMoney: function(value) {
      return '$' + value.toLocaleString();
    },
    formatDays: function(value) {
      return value + " Days";
    }
  }
}
</script>

<style lang="less" scoped>

</style>
