<template>
  <div class="seat-allocation-result">
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
      <div class="analysis-area">
        <table class="result-table">
          <tr>
            <td colspan="2" style="text-align: center">
              <font-awesome-icon :icon="['fas', 'gas-pump']" class="result-icon" />
              <span class="analysis-item-title">Fuel</span>
            </td>
          </tr>
          <tr>
            <td class="analysis-item-title">Consumption</td>
            <td>{{ consumption }} lbs/km</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Cost</td>
            <td>{{ (Math.ceil(consumption * range)).toLocaleString('en-US') }} lbs</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Spend</td>
            <td>{{ (Math.ceil(fuel_flight_spend)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
        </table>
      </div>
      <div class="solid-line"></div>
      <div class="analysis-area">
        <table class="result-table">
          <tr>
            <td colspan="2" style="text-align: center">
              <font-awesome-icon :icon="['fas', 'leaf']" class="result-icon" />
              <span class="analysis-item-title">Est. CO<span class="sub">2</span></span>
            </td>
          </tr>
          <tr>
            <td class="analysis-item-title">Emission</td>
            <td>{{ co2 }} kg/pax/km</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Cost</td>
            <td>{{ parseInt(co2_total).toLocaleString('en-US') }} kg</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Spend</td>
            <td>{{ (Math.ceil(co2_flight_spend)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
        </table>
      </div>
      <div class="solid-line"></div>
      <div class="analysis-area">
        <table class="result-table">
          <tr>
            <td colspan="2" style="text-align: center">
              <font-awesome-icon :icon="['fas', 'sack-dollar']" class="result-icon" />
              <span class="analysis-item-title">Est. Profit</span>
            </td>
          </tr>
          <tr>
            <td class="analysis-item-title">Flight Gross</td>
            <td>{{ parseInt(gross_profit.flight_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Daily Gross</td>
            <td>{{ parseInt(gross_profit.daily_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Flight Net</td>
            <td>{{ parseInt(net_profit.flight_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
          <tr>
            <td class="analysis-item-title">Daily Net</td>
            <td>{{ parseInt(net_profit.daily_profit).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["seat_allocation_result", "ticket_price", "consumption", "range", "fuel_flight_spend", "co2", "co2_total",
  "co2_flight_spend", "gross_profit", "net_profit"]
}
</script>

<style lang="less" scoped>
.result-icon {
  max-height: 20px;
  max-width: 25px;
  margin-right: 5px;
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
.analysis-area {
  display: flex;
  justify-content: center;
  .analysis-item-title {
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
