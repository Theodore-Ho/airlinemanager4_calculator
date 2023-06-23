<template>
  <div id="app">
    <div class="header" @click="$bvModal.show('tips-modal')">
      <h2>AirlineManager4 <span style="white-space:nowrap">Calculator<span class="icon-margin"><font-awesome-icon :icon="['fas', 'circle-info']" /></span></span></h2>
    </div>
    <b-modal id="tips-modal" hide-footer>
      <template #modal-title>
        Info
      </template>
      <div class="d-block">
        <div>
          <p>This calculator is used to calculate some useful information for the AirlineManager4 game,
            currently only available in the realism mode and PAX calculate.
            AM4's mathematical calculations contain a lot of random content.
            There are deviations in this calculator, and the results are for reference only.
            Here are some built in parameters:</p>
          <ul>
            <li>Player's Daily Active Hour: 16h</li>
            <li>Default Airline Reputation: 45%</li>
            <li>CO<span class="sub">2</span> Price: $150 per 1,000 quotas</li>
            <li>Increase Airline Reputation: 7.5%, 14%, 21.5%, 30%</li>
            <li>Eco-friendly Reputation Increase: 10%</li>
          </ul>
          <p>GitHub: <a href="#">TheodoreHo/airlinemanager4</a></p>
          <p>Contact: <a href="mailto:he@yuhong.me">he@yuhong.me</a></p>
        </div>
      </div>
      <b-button class="mt-3" block @click="$bvModal.hide('tips-modal')">Close</b-button>
    </b-modal>
    <div class="form">
      <div class="route-info">
        <b-container>
          <b-row class="g-4">
            <b-col lg="6">
              <b-form-group label="How frequently can you operate in a day?" label-for="frequently_operate">
                <b-form-select
                    id="frequently_operate"
                    v-model="selected_frequently"
                    :options="frequently_options"
                    required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col lg="6">
              <b-form-group label="How much do you purchase fuel?" label-for="fuel_purchase">
                <b-form-select
                    id="fuel_purchase"
                    v-model="selected_fuel"
                    :options="fuel_options"
                    required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="Your Airline Reputation Policy" label-for="airline_reputation">
                <b-form-select
                    id="airline_reputation"
                    v-model="selected_airline_reputation"
                    :options="airline_reputation"
                    required
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="Your Airline Reputation Duration" label-for="airline_reputation_duration">
                <b-form-select
                    id="airline_reputation_duration"
                    v-model="selected_airline_reputation_duration"
                    :options="airline_reputation_duration"
                    required
                    :disabled="selected_airline_reputation === 0"
                ></b-form-select>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="Your Daily Eco-friendly Policy" label-for="daily_ecoFriendly">
                <b-form-select
                    id="daily_ecoFriendly"
                    v-model="selected_daily_ecoFriendly"
                    :options="daily_ecoFriendly_option"
                    required
                ></b-form-select>
              </b-form-group>
            </b-col>
          </b-row>
          <b-row class="g-4">
            <b-col md="12">
              <b-form-group label="Range" label-for="range">
                <b-form-input id="range" type="number" v-model="range" :state="validate_range"></b-form-input>
                <b-form-invalid-feedback :state="validate_range">
                  Please enter range (100 ~ 36000).
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="Economy Class Demand" label-for="economy_demand">
                <b-form-input id="economy_demand" type="number" v-model="economyDemand" :state="validate_e_demand"></b-form-input>
                <b-form-invalid-feedback :state="validate_e_demand">
                  Please enter economy class demand.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="Business Class Demand" label-for="business_demand">
                <b-form-input id="business_demand" type="number" v-model="businessDemand" :state="validate_b_demand"></b-form-input>
                <b-form-invalid-feedback :state="validate_b_demand">
                  Please enter business class demand.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col lg="4">
              <b-form-group label="First Class Demand" label-for="first_demand">
                <b-form-input id="first_demand" type="number" v-model="firstDemand" :state="validate_f_demand"></b-form-input>
                <b-form-invalid-feedback :state="validate_f_demand">
                  Please enter first class demand.
                </b-form-invalid-feedback>
              </b-form-group>
            </b-col>
            <b-col md="4">
              <div id="aircraft-selector-area">
                <b-form-group label="Aircraft" label-for="aircraft">
                  <AircraftSelector @getSelectedAircraft="getAircraft" id="aircraft"></AircraftSelector>
                </b-form-group>
              </div>
            </b-col>
            <b-col md="4">
              <b-form-group label="Minimum Runway" label-for="runway">
                <b-form-input id="runway" type="number" v-model="runway" :disabled="aircraft_selected !== 'find'"></b-form-input>
              </b-form-group>
            </b-col>
            <b-col md="4" class="d-flex align-items-end justify-content-center">
              <b-form-group id="stopover" v-slot="{ ariaDescribedby }">
                <b-form-checkbox
                    v-model="stopover"
                    value="Yes"
                    unchecked-value="No"
                    size="lg"
                    :disabled="aircraft_selected !== 'find'"
                >
                  Consider stopover
                </b-form-checkbox>
              </b-form-group>
            </b-col>
          </b-row>
        </b-container>
      </div>
    </div>
    <div class="cal-btn">
      <b-button v-if="aircraft_selected === 'find'" variant="outline-primary" @click="generateRecommendList">Generate Recommend Aircraft List</b-button>
      <b-button v-else variant="outline-dark" @click="calculateSeatAllocation">Calculate Seat Allocation</b-button>
    </div>
    <div class="seat-allocation-result" v-if="display_seat_allocation_result">
      <div class="seat-allocation-result-title">Seat Allocation Result</div>
      <div class="seat-allocation-result-block-area">
        <div class="seat-allocation-result-block">
          <font-awesome-icon :icon="['fas', 'plane-departure']" class="result-icon" />
          <span class="seat-allocation-result-block-title">Max Daily Flight:</span>
          <span class="seat-allocation-result-block-content">{{ seat_allocation_result.flightTimes }}</span>
        </div>
        <div class="seat-allocation-result-block">
          <img class="result-icon" :src="require('@/assets/img/economy.png')" alt=""/>
          <span class="seat-allocation-result-block-title">Economy:</span>
          <span class="seat-allocation-result-block-content">{{ seat_allocation_result.Economy }}</span>
        </div>
        <div class="seat-allocation-result-block">
          <img class="result-icon" :src="require('@/assets/img/business.png')" alt=""/>
          <span class="seat-allocation-result-block-title">Business:</span>
          <span class="seat-allocation-result-block-content">{{ seat_allocation_result.Business }}</span>
        </div>
        <div class="seat-allocation-result-block">
          <img class="result-icon" :src="require('@/assets/img/first.png')" alt=""/>
          <span class="seat-allocation-result-block-title">First:</span>
          <span class="seat-allocation-result-block-content">{{ seat_allocation_result.First }}</span>
        </div>
      </div>
      <div class="seat-allocation-result-warning" v-if="seat_allocation_result.TooBig === 'Yes'">This aircraft is too big for the route.</div>
      <div class="seat-allocation-analysis-area">
        <div class="seat-allocation-analysis-title">Further Analysis</div>
        <div class="ticket-price-area">
          <div>
            <font-awesome-icon :icon="['fas', 'money-bill']" class="result-icon" />
            <span class="ticket-price-item-title">Est. Ticket Price</span>
          </div>
          <span class="ticket-price-item">
            <img class="result-icon" :src="require('@/assets/img/economy.png')" alt=""/>
            <span>{{ parseInt(ticket_price.economy).toLocaleString('en-US') }}</span>
          </span>
          <span class="ticket-price-item">
            <img class="result-icon" :src="require('@/assets/img/business.png')" alt=""/>
            <span>{{ parseInt(ticket_price.business).toLocaleString('en-US') }}</span>
          </span>
          <span class="ticket-price-item">
            <img class="result-icon" :src="require('@/assets/img/first.png')" alt=""/>
            <span>{{ parseInt(ticket_price.first).toLocaleString('en-US') }}</span>
          </span>
        </div>
        <div class="solid-line"></div>
        <div class="consumption-area">
          <table class="result-table">
            <tr>
              <td colspan="2" style="text-align: center">
                <font-awesome-icon :icon="['fas', 'gas-pump']" class="result-icon" />
                <span class="consumption-item-title">Fuel</span>
              </td>
            </tr>
            <tr>
              <td class="consumption-item-title">Consumption</td>
              <td>{{ consumption }} lbs/km</td>
            </tr>
            <tr>
              <td class="consumption-item-title">Cost</td>
              <td>{{ (Math.ceil(consumption * range)).toLocaleString('en-US') }} lbs</td>
            </tr>
            <tr>
              <td class="consumption-item-title">Spend</td>
              <td>{{ (Math.ceil(fuel_flight_spend)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
          </table>
        </div>
        <div class="solid-line"></div>
        <div class="co2-area">
          <table class="result-table">
            <tr>
              <td colspan="2" style="text-align: center">
                <font-awesome-icon :icon="['fas', 'leaf']" class="result-icon" />
                <span class="co2-item-title">Est. CO<span class="sub">2</span></span>
              </td>
            </tr>
            <tr>
              <td class="co2-item-title">Emission</td>
              <td>{{ co2 }} kg/pax/km</td>
            </tr>
            <tr>
              <td class="co2-item-title">Cost</td>
              <td>{{ parseInt(co2_total).toLocaleString('en-US') }} kg</td>
            </tr>
            <tr>
              <td class="co2-item-title">Spend</td>
              <td>{{ (Math.ceil(co2_flight_spend)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
          </table>
        </div>
        <div class="solid-line"></div>
        <div class="profit-area">
          <table class="result-table">
            <tr>
              <td colspan="2" style="text-align: center">
                <font-awesome-icon :icon="['fas', 'sack-dollar']" class="result-icon" />
                <span class="consumption-item-title">Est. Profit</span>
              </td>
            </tr>
            <tr>
              <td class="consumption-item-title">Flight Gross</td>
              <td>{{ parseInt(gross_profit.flight_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
            <tr>
              <td class="consumption-item-title">Daily Gross</td>
              <td>{{ parseInt(gross_profit.daily_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
            <tr>
              <td class="consumption-item-title">Flight Net</td>
              <td>{{ parseInt(net_profit.flight_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
            <tr>
              <td class="consumption-item-title">Daily Net</td>
              <td>{{ parseInt(net_profit.daily_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
            </tr>
          </table>
        </div>
      </div>
    </div>

    <vue-good-table :columns="columns" :rows="rows" />
  </div>
</template>

<script>
import AircraftSelector from "@/components/AircraftSelector.vue";
import {mapMutations, mapState} from "vuex";
import {calculateSeatAllocation, filterAircraft, getAircraftByName, getPrice, getDailyPax, getEachFlightSeatPax} from "@/utils/common";
import 'vue-good-table/dist/vue-good-table.css'
import { VueGoodTable } from 'vue-good-table';

export default {
  components: {
    AircraftSelector,
    VueGoodTable
  },
  computed: {
    ...mapState('Marketing', ['airlineReputation', 'reputationDuration', 'ecoFriendly']),
    ...mapState('Settings', ['frequently', 'fuel']),
    validate_range() {
      return parseInt(this.range) >= 100 && parseInt(this.range) <= 36000
    },
    validate_e_demand() {
      return parseInt(this.economyDemand) >= 0
    },
    validate_b_demand() {
      return parseInt(this.businessDemand) >= 0
    },
    validate_f_demand() {
      return parseInt(this.firstDemand) >= 0
    }
  },
  data() {
    return {
      columns: [
        {
          label: 'Name',
          field: 'name',
        },
        {
          label: 'Age',
          field: 'age',
        },
        {
          label: 'Email',
          field: 'email',
        },
      ],
      rows: [
        {
          name: 'John Doe',
          age: 25,
          email: 'john.doe@example.com',
        },
        {
          name: 'Jane Smith',
          age: 30,
          email: 'jane.smith@example.com',
        },
      ],
      selected_frequently: 12,
      frequently_options: [
        { text: '1 time a day', value: 1 },
        { text: '2 times a day', value: 2 },
        { text: '3 times a day', value: 3 },
        { text: '4 times a day', value: 4 },
        { text: '5 times a day', value: 5 },
        { text: '6 times a day', value: 6 },
        { text: '7 times a day', value: 7 },
        { text: '8 times a day', value: 8 },
        { text: '9 times a day', value: 9 },
        { text: '10 times a day', value: 10 },
        { text: '11 times a day', value: 11 },
        { text: '12 times a day', value: 12 },
        { text: '13 times a day', value: 13 },
        { text: '14 times a day', value: 14 },
        { text: '15 times a day', value: 15 },
        { text: '16 times a day', value: 16 },
        { text: '17 times a day', value: 17 },
        { text: '18 times a day', value: 18 },
        { text: '19 times a day', value: 19 },
        { text: '20 times a day', value: 20 },
        { text: '21 times a day', value: 21 },
        { text: '22 times a day', value: 22 },
        { text: '23 times a day', value: 23 },
        { text: '24 times a day', value: 24 },
        { text: '25 times a day', value: 25 },
        { text: '26 times a day', value: 26 },
        { text: '27 times a day', value: 27 },
        { text: '28 times a day', value: 28 },
        { text: '29 times a day', value: 29 },
        { text: '30 times a day', value: 30 }
      ],
      selected_fuel: 500,
      fuel_options: [
        { text: '$ 200', value: 200 },
        { text: '$ 300', value: 300 },
        { text: '$ 400', value: 400 },
        { text: '$ 500', value: 500 },
        { text: '$ 600', value: 600 },
        { text: '$ 700', value: 700 },
        { text: '$ 800', value: 800 },
        { text: '$ 900', value: 900 },
        { text: '$ 1000', value: 1000 },
        { text: '$ 1100', value: 1100 },
        { text: '$ 1200', value: 1200 },
        { text: '$ 1300', value: 1300 },
        { text: '$ 1400', value: 1400 },
        { text: '$ 1500', value: 1500 }
      ],
      range: null,
      runway: null,
      economyDemand: null,
      businessDemand: null,
      firstDemand: null,
      selected_airline_reputation: 0,
      airline_reputation: [
        { text: 'No Reputation', value: 0 },
        { text: '5 - 10%', value: 0.075 },
        { text: '10 - 18%', value: 0.14 },
        { text: '18 - 25%', value: 0.215 },
        { text: '25 - 35%', value: 0.3 }
      ],
      selected_airline_reputation_duration: 0,
      airline_reputation_duration: [
        { text: 'No Reputation', value: 0, disabled: true },
        { text: '4 Hours', value: 4 },
        { text: '8 Hours', value: 8 },
        { text: '12 Hours', value: 12 },
        { text: '16 Hours', value: 16 },
        { text: '20 Hours', value: 20 },
        { text: '24 Hours', value: 24 }
      ],
      selected_daily_ecoFriendly: 0,
      daily_ecoFriendly_option: [
        { text: 'No Eco-friendly', value: 0 },
        { text: 'Once a day', value: 1 },
        { text: 'Twice a day', value: 2 }
      ],
      aircraft_selected: "find",
      aircraft: {},
      stopover: "No",
      display_seat_allocation_result: false,
      seat_allocation_result: {},
      ticket_price: {},
      consumption: 0,
      co2: 0,
      co2_total: 0,
      co2_price: 150,
      fuel_flight_spend: 0,
      co2_flight_spend: 0,
      gross_profit: {
        flight_profit: 0,
        daily_profit: 0
      },
      net_profit: {
        flight_profit: 0,
        daily_profit: 0
      },
    };
  },
  created() {
    if(this.frequently > 0) {
      this.selected_frequently = this.frequently;
    }
    if(this.fuel !== 500) {
      this.selected_fuel = this.fuel;
    }
    if(this.airlineReputation > 0) {
      this.selected_airline_reputation = this.airlineReputation;
    }
    if(this.reputationDuration > 0) {
      this.selected_airline_reputation_duration = this.reputationDuration;
    }
    if(this.ecoFriendly > 0) {
      this.selected_daily_ecoFriendly = this.ecoFriendly;
    }
  },
  watch: {
    selected_frequently(val) {
      this.setFrequently(val);
    },
    selected_fuel(val) {
      this.setFuel(val);
    },
    selected_airline_reputation(val) {
      this.setAirlineReputation(val);
      if(val === 0) {
        this.selected_airline_reputation_duration = 0;
      } else {
        if(this.selected_airline_reputation_duration === 0) {
          this.selected_airline_reputation_duration = 4;
        }
      }
    },
    selected_airline_reputation_duration(val) {
      this.setReputationDuration(val);
    },
    selected_daily_ecoFriendly(val) {
      this.setEcoFriendly(val);
    },
    aircraft_selected(val) {
      if(val !== 'find') {
        this.stopover = "No";
      }
    }
  },
  methods: {
    ...mapMutations('Marketing', ['setAirlineReputation', 'setReputationDuration', 'setEcoFriendly']),
    ...mapMutations('Settings', ['setFrequently', 'setFuel']),
    getAircraft(val) {
      this.aircraft_selected= val;
      this.aircraft = getAircraftByName(this.aircraft_selected);
    },
    calculateSeatAllocation() {
      this.display_seat_allocation_result = false;
      if(parseInt(this.range) > 100 && parseInt(this.range) < 36000 &&
          parseInt(this.economyDemand) >= 0 && parseInt(this.businessDemand) >= 0 && parseInt(this.firstDemand) >= 0) {
        this.seat_allocation_result = calculateSeatAllocation(this.selected_frequently, parseInt(this.range), parseInt(this.economyDemand),
            parseInt(this.businessDemand), parseInt(this.firstDemand), this.selected_airline_reputation,
            this.selected_airline_reputation_duration, this.selected_daily_ecoFriendly, this.aircraft);
        this.ticket_price = getPrice(this.range);
        const daily_pax = getDailyPax(this.seat_allocation_result, this.selected_airline_reputation,
            this.selected_airline_reputation_duration, this.selected_daily_ecoFriendly, this.aircraft, this.range);
        this.consumption = this.aircraft.consumption;
        this.fuel_flight_spend = this.consumption * this.range / 1000 * this.selected_fuel;
        this.co2 = this.aircraft.co2;
        this.co2_total = (this.co2 * (daily_pax / this.seat_allocation_result.flightTimes) * this.range * 3).toFixed(2); // 3 is the approximate proportion number
        this.co2_flight_spend = this.co2_total / 1000 * this.co2_price;
        const flight_pax = getEachFlightSeatPax(this.seat_allocation_result, daily_pax, this.aircraft, this.range);
        this.gross_profit.flight_profit = flight_pax.pax_b * this.ticket_price.economy +
            flight_pax.pax_b * this.ticket_price.business + flight_pax.pax_f * this.ticket_price.first;
        let flightTimes = this.seat_allocation_result.flightTimes;
        if(this.range / this.aircraft.speed > 24) {
          flightTimes = 1;
        } else if(this.range / this.aircraft.speed > 12) {
          flightTimes = 1.5;
        }
        this.gross_profit.daily_profit = flightTimes * this.gross_profit.flight_profit;
        this.net_profit.flight_profit = this.gross_profit.flight_profit - this.fuel_flight_spend - this.co2_flight_spend;
        this.net_profit.daily_profit = flightTimes * this.net_profit.flight_profit;
        this.display_seat_allocation_result = true;
      }
    },
    generateRecommendList() {
      // console.log(filterAircraft(parseInt(this.range), parseInt(this.runway)));
      // console.log("range: " + this.range);
      // console.log("runway: " + this.runway);
      // console.log("economyDemand: " + this.economyDemand);
      // console.log("businessDemand: " + this.businessDemand);
      // console.log("firstDemand: " + this.firstDemand);
      // console.log("selected_airline_reputation: " + this.selected_airline_reputation);
      // console.log("selected_airline_reputation_duration: " + this.selected_airline_reputation_duration);
      // console.log("selected_daily_ecoFriendly: " + this.selected_daily_ecoFriendly);
      // console.log("aircraft_selected: " + this.aircraft_selected);
      // console.log("stopover: " + this.stopover);
      console.log(getPrice(this.range));
    },
  }
}
</script>

<style lang="less" scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  width: 70%;
  margin-left: 15%;
}
.header {
  text-align: center;
  cursor: pointer;
}
.header:hover {
  color: midnightblue;
}
.header:active {
  color: mediumblue;
}
.icon-margin {
  margin-left: 5px;
}
.result-icon {
  max-height: 20px;
  max-width: 25px;
  margin-right: 5px;
}
.form {
  padding-top: 20px;
}
.cal-btn {
  margin-top: 30px;
  margin-bottom: 30px;
  display: flex;
  justify-content: center;
}
.seat-allocation-result {
  width: 100%;
  margin-bottom: 30px;
  border: 1px solid;
  border-radius: 20px;
  background-color: rgba(200, 200, 200, 0.2);
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
  padding: 10px;
  .seat-allocation-result-title {
    width: 100%;
    font-weight: bold;
    font-size: 1.5em;
    font-family: Verdana,serif;
    text-align: center;
    margin-bottom: 10px;
  }
  .seat-allocation-result-block-area {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    grid-gap: 20px;
    margin-bottom: 10px;
  }
  .seat-allocation-result-warning {
    color: red;
    font-weight: bold;
    text-align: center;
  }
}
.seat-allocation-result-block {
  display: inline;
  font-size: 1.2em;

  .seat-allocation-result-block-title {
    font-weight: bold;
    font-family: "Times New Roman",serif;
    margin-right: 10px;
  }

  .seat-allocation-result-block-content {
    font-weight: bold;
    color: darkgreen;
  }
}
@media (max-width: 400px) {
  .seat-allocation-analysis-area {
    margin: 20px 10px 10px 10px;
    background-color: white;
    border: none;
    border-radius: 20px;
  }
}
@media (max-width: 515px) and (min-width: 400px) {
  .seat-allocation-analysis-area {
    margin: 20px 20px 10px 20px;
    background-color: white;
    border: none;
    border-radius: 20px;
  }
}
@media (min-width: 515px) {
  .seat-allocation-analysis-area {
    margin: 20px 50px 10px 50px;
    background-color: white;
    border: none;
    border-radius: 20px;
  }
}
.seat-allocation-analysis-title {
  width: 100%;
  font-weight: bold;
  font-size: 1.3em;
  font-family: Verdana,serif;
  text-align: center;
  line-height: 40px;
  color: dimgrey;
}
.ticket-price-area {
  text-align: center;
  .ticket-price-item-title {
    font-weight: bold;
    font-size: 1.1em;
  }
  .ticket-price-item {
    white-space:nowrap;
    margin-left: 20px;
    margin-right: 20px;
  }
}
.consumption-area {
  display: flex;
  justify-content: center;
  .consumption-item-title {
    margin-right: 20px;
    font-weight: bold;
    font-size: 1.1em;
  }
}
.co2-area {
  display: flex;
  justify-content: center;
  .co2-item-title {
    margin-right: 20px;
    font-weight: bold;
    font-size: 1.1em;
  }
}
.profit-area {
  display: flex;
  justify-content: center;
  .consumption-item-title {
    margin-right: 20px;
    font-weight: bold;
    font-size: 1.1em;
  }
}
.result-table {
  border: none;
  min-width: 200px;
}
.solid-line {
  margin: 10px 5%;
  height: 1px;
  border-top: solid #ACC0D8 1px;
}
.sub {
  vertical-align: text-bottom;
  font-size: 0.5em;
}
</style>
