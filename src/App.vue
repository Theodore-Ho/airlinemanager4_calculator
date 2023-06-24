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
          <p>GitHub: <a href="https://github.com/Theodore-Ho/airlinemanager4_calculator">Theodore-Ho/airlinemanager4_calculator</a></p>
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
                  <AircraftSelector @getSelectedAircraft="getAircraft" :aircraft_selected="aircraft_selected" id="aircraft"></AircraftSelector>
                </b-form-group>
              </div>
            </b-col>
            <b-col md="4">
              <b-form-group label="Minimum Runway" label-for="runway">
                <b-form-input id="runway" type="number" v-model="runway" :disabled="aircraft_selected !== 'find'" :state="validate_runway"></b-form-input>
                <b-form-invalid-feedback :state="validate_runway">
                  Please enter the minimum runway.
                </b-form-invalid-feedback>
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
    <SeatAllocationResult v-if="display_seat_allocation_result" :seat_allocation_result="seat_allocation_result"
                          :ticket_price="ticket_price" :consumption="consumption" :range="range"
                          :fuel_flight_spend="fuel_flight_spend" :co2="co2" :co2_total="co2_total"
                          :co2_flight_spend="co2_flight_spend" :gross_profit="gross_profit"
                          :net_profit="net_profit"></SeatAllocationResult>
    <RecommendAircraftList v-if="display_recommend_aircraft_list" :aircraft_data="recommend_aircraft_data"
                           @getSelectedAircraft="getAircraftFromRecommend"></RecommendAircraftList>
  </div>
</template>

<script>
import Config from "@/assets/data/config.json";
import AircraftSelector from "@/components/AircraftSelector.vue";
import SeatAllocationResult from "@/views/SeatAllocationResult.vue";
import RecommendAircraftList from "@/views/RecommendAircraftList.vue";
import {mapMutations, mapState} from "vuex";
import {calculateSeatAllocation, filterAircraft, getAircraftByName, getPrice, getDailyPax, getEachFlightSeatPax} from "@/utils/common";

export default {
  components: {
    AircraftSelector,
    SeatAllocationResult,
    RecommendAircraftList
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
    },
    validate_runway() {
      return parseInt(this.runway) >= 0 || this.aircraft_selected !== 'find'
    }
  },
  data() {
    return {
      selected_frequently: 12,
      frequently_options: Config.frequently_options,
      selected_fuel: 500,
      fuel_options: Config.fuel_options,
      range: null,
      runway: null,
      economyDemand: null,
      businessDemand: null,
      firstDemand: null,
      selected_airline_reputation: 0,
      airline_reputation: Config.airline_reputation,
      selected_airline_reputation_duration: 0,
      airline_reputation_duration: Config.airline_reputation_duration,
      selected_daily_ecoFriendly: 0,
      daily_ecoFriendly_option: Config.daily_ecoFriendly_option,
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
      recommend_aircraft_data: [],
      display_recommend_aircraft_list: false,
      temporary_runway: null
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
        if(!this.temporary_runway) {
          this.runway = "";
        }
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
    getAircraftFromRecommend(val) {
      this.aircraft_selected= val;
      this.aircraft = getAircraftByName(this.aircraft_selected);
      this.temporary_runway = this.runway;
      this.calculateSeatAllocation();
    },
    calculateSeatAllocation() {
      this.display_seat_allocation_result = false;
      this.display_recommend_aircraft_list = false;
      if(parseInt(this.range) > 100 && parseInt(this.range) < 36000 &&
          parseInt(this.economyDemand) >= 0 && parseInt(this.businessDemand) >= 0 && parseInt(this.firstDemand) >= 0) {

        this.seat_allocation_result = calculateSeatAllocation(this.selected_frequently, parseInt(this.range),
            parseInt(this.economyDemand), parseInt(this.businessDemand), parseInt(this.firstDemand),
            this.selected_airline_reputation, this.selected_airline_reputation_duration,
            this.selected_daily_ecoFriendly, this.aircraft);
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
        const flight_long = this.range / this.aircraft.speed;
        if(flight_long > 24) {
          flightTimes = 1;
        } else if(flight_long > 12) {
          flightTimes = 1.5;
        }
        this.gross_profit.daily_profit = flightTimes * this.gross_profit.flight_profit;
        const depreciation = flight_long / this.aircraft.maint_check * this.aircraft.a_check;
        this.net_profit.flight_profit = this.gross_profit.flight_profit - this.fuel_flight_spend
            - this.co2_flight_spend - depreciation;
        this.net_profit.daily_profit = flightTimes * this.net_profit.flight_profit;
        this.display_seat_allocation_result = true;
      }
    },
    generateRecommendList() {
      this.display_seat_allocation_result = false;
      this.display_recommend_aircraft_list = false;
      this.recommend_aircraft_data = [];
      if(parseInt(this.range) > 100 && parseInt(this.range) < 36000 && parseInt(this.runway) > 0 &&
          parseInt(this.economyDemand) >= 0 && parseInt(this.businessDemand) >= 0 && parseInt(this.firstDemand) >= 0) {

        const aircraft_list = filterAircraft(this.range, this.runway, this.stopover);
        const ticket_price = getPrice(this.range);
        aircraft_list.forEach(item => {
          let aircraft = {
            name: item.name,
            img: '<img src="' + require(`@/assets/img/aircraft/${item.img}`) + '" alt="">',
            price: parseInt(item.price),
            flight_times: null,
            flight_gross: null,
            flight_net: null,
            payback_cycle: null
          }

          const seat_allocation_result = calculateSeatAllocation(this.selected_frequently, parseInt(this.range),
              parseInt(this.economyDemand), parseInt(this.businessDemand), parseInt(this.firstDemand),
              this.selected_airline_reputation, this.selected_airline_reputation_duration,
              this.selected_daily_ecoFriendly, item);
          const daily_pax = getDailyPax(seat_allocation_result, this.selected_airline_reputation,
              this.selected_airline_reputation_duration, this.selected_daily_ecoFriendly, item, this.range);
          const fuel_flight_spend = Math.ceil(item.consumption * this.range / 1000 * this.selected_fuel);
          const co2_flight_spend = Math.ceil((item.co2 * (daily_pax / seat_allocation_result.flightTimes) * this.range * 3).toFixed(2) / 1000 * this.co2_price);
          const flight_pax = getEachFlightSeatPax(seat_allocation_result, daily_pax, item, this.range);
          const gross_flight_profit = flight_pax.pax_b * ticket_price.economy +
              flight_pax.pax_b * ticket_price.business + flight_pax.pax_f * ticket_price.first;
          let flightTimes = seat_allocation_result.flightTimes;
          const flight_long = this.range / item.speed;
          if(flight_long > 24) {
            flightTimes = 1;
          } else if(flight_long > 12) {
            flightTimes = 1.5;
          }
          const depreciation = Math.ceil(flight_long / item.maint_check * item.a_check);
          const net_flight_profit = gross_flight_profit - fuel_flight_spend - co2_flight_spend - depreciation;
          const net_daily_profit = flightTimes * net_flight_profit;

          aircraft.flight_times = flightTimes;
          aircraft.flight_gross = parseInt(gross_flight_profit);
          aircraft.flight_net = parseInt(net_flight_profit);
          aircraft.payback_cycle = parseInt(item.price / net_daily_profit);

          this.recommend_aircraft_data.push(aircraft);
        });
        this.display_recommend_aircraft_list = true;
      }
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
  padding-bottom: 40px;
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
.sub {
  vertical-align: text-bottom;
  font-size: 0.5em;
}
</style>
