import AircraftData from "@/assets/data/aircraft.json"
import Ticket from "@/assets/data/ticket.json"
import _ from "lodash"

const active_hour = 16;
const default_proportion = 0.45;
const eco_friendly_proportion = 0.1;

export function filterAircraft(range, runway, stopover) {
    let filtered_aircraft = [];
    AircraftData.data.forEach(item => {
        const distance = stopover === "Yes" ? parseInt(item.distance) * 1.9 : parseInt(item.distance);
        if(range <= distance && runway >= parseInt(item.runway)) {
            filtered_aircraft.push(item);
        }
    })
    return filtered_aircraft;
}

export function getAircraftByName(name) {
    return _.find(AircraftData.data, function (aircraft) {
        if (aircraft.name === name) {
            return true;
        }
    }, 0);
}

export function calculateSeatAllocation(frequently, range, demand_e, demand_b, demand_f, airline_reputation, reputation_duration, ecoFriendly, aircraft) {
    const capacity = parseInt(aircraft.capacity);
    if(reputation_duration > active_hour) {
        reputation_duration = active_hour;
    }

    const flight_long = range / aircraft.speed; // how many hours is the flight
    let flight_times = Math.ceil(active_hour / flight_long); // how many times a day can fly
    flight_times = flight_times > frequently ? frequently : flight_times;

    let seat_allocation = {
        flightTimes: flight_times,
        Economy: 0,
        Business: 0,
        First: 0,
        TooBig: "No"
    }

    if(airline_reputation === 0 && ecoFriendly === 0) { // case no reputation and no eco-friendly
        if(Math.floor(capacity / 3) * default_proportion * flight_times < demand_f) { // case all first
            seat_allocation.First = Math.floor(capacity / 3);
            seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
            seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
        } else { // case first and others
            const first = Math.floor(demand_f / flight_times / default_proportion);
            let remain_seat = capacity - first * 3;
            if(Math.floor(remain_seat / 2) * default_proportion * flight_times < demand_b) { // case all first and business
                const business = Math.floor(remain_seat / 2);
                seat_allocation.Economy = remain_seat - business * 2;
                seat_allocation.Business = business;
                seat_allocation.First = first;
            } else { // case first, business, and others
                const business = Math.floor(demand_b / flight_times / default_proportion);
                remain_seat = remain_seat - business * 2;
                seat_allocation.Economy = remain_seat;
                seat_allocation.Business = business;
                seat_allocation.First = first;
                if(remain_seat * default_proportion * flight_times > demand_e) {
                    seat_allocation.TooBig = "Yes";
                }
            }
        }
    } else if(ecoFriendly === 0) { // case no eco-friendly
        let reputation_times = Math.ceil(reputation_duration / active_hour * flight_times);
        let remain_times = flight_times - reputation_times;
        const ability_f = Math.floor(capacity / 3) * (default_proportion + airline_reputation) * reputation_times +
            Math.floor(capacity / 3) * default_proportion * remain_times;
        if(ability_f < demand_f) { // case all first
            seat_allocation.First = Math.floor(capacity / 3);
            seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
            seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
        } else { // case first and others
            const first = Math.floor(demand_f / (reputation_times * (default_proportion + airline_reputation)
                + remain_times * default_proportion));
            let remain_seat = capacity - first * 3;
            const remain_ability_b = Math.floor(remain_seat / 2) * reputation_times * (default_proportion +
                airline_reputation) + Math.floor(remain_seat / 2) * remain_times * default_proportion;
            if(remain_ability_b < demand_b) { // case all first and business
                const business = Math.floor(remain_seat / 2);
                seat_allocation.Economy = remain_seat - business * 2;
                seat_allocation.Business = business;
                seat_allocation.First = first;
            } else { // case first, business, and others
                const business = Math.floor(demand_b / (reputation_times * (default_proportion + airline_reputation) +
                    remain_times * default_proportion));
                remain_seat = remain_seat - business * 2;
                seat_allocation.Economy = remain_seat;
                seat_allocation.Business = business;
                seat_allocation.First = first;
                const remain_ability_e = remain_seat * reputation_times * (default_proportion + airline_reputation) +
                    remain_seat * remain_times * default_proportion;
                if(remain_ability_e > demand_e) {
                    seat_allocation.TooBig = "Yes";
                }
            }
        }
    } else if(airline_reputation === 0) { // case no reputation
        let ecoFriendly_duration = 12; // case ecoFriendly once a day
        if(ecoFriendly === 2) {
            ecoFriendly_duration = active_hour;
        }
        let ecoFriendly_times = Math.ceil(ecoFriendly_duration / active_hour * flight_times);
        let remain_ecoFriendly_times = flight_times - ecoFriendly_times;
        const ability_f = Math.floor(capacity / 3) * (default_proportion + eco_friendly_proportion) * ecoFriendly_times +
            Math.floor(capacity / 3) * default_proportion * remain_ecoFriendly_times;
        if(ability_f < demand_f) { // case all first
            seat_allocation.First = Math.floor(capacity / 3);
            seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
            seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
        } else { // case first and others
            const first = Math.floor(demand_f / (ecoFriendly_times * (default_proportion + eco_friendly_proportion)
                + remain_ecoFriendly_times * default_proportion));
            let remain_seat = capacity - first * 3;
            const remain_ability_b = Math.floor(remain_seat / 2) * ecoFriendly_times * (default_proportion +
                eco_friendly_proportion) + Math.floor(remain_seat / 2) * remain_ecoFriendly_times * default_proportion;
            if(remain_ability_b < demand_b) { // case all first and business
                const business = Math.floor(remain_seat / 2);
                seat_allocation.Economy = remain_seat - business * 2;
                seat_allocation.Business = business;
                seat_allocation.First = first;
            } else { // case first, business, and others
                const business = Math.floor(demand_b / (ecoFriendly_times * (default_proportion + eco_friendly_proportion) +
                    remain_ecoFriendly_times * default_proportion));
                remain_seat = remain_seat - business * 2;
                seat_allocation.Economy = remain_seat;
                seat_allocation.Business = business;
                seat_allocation.First = first;
                const remain_ability_e = remain_seat * ecoFriendly_times * (default_proportion + eco_friendly_proportion) +
                    remain_seat * remain_ecoFriendly_times * default_proportion;
                if(remain_ability_e > demand_e) {
                    seat_allocation.TooBig = "Yes";
                }
            }
        }
    } else { // case has reputation and ecoFriendly
        let ecoFriendly_duration = 12; // case ecoFriendly once a day
        if(ecoFriendly === 2) {
            ecoFriendly_duration = active_hour;
        }
        if(reputation_duration < ecoFriendly_duration) {
            let reputation_times = Math.ceil(reputation_duration / active_hour * flight_times);
            let ecoFriendly_times = Math.ceil((ecoFriendly_duration - reputation_duration) / active_hour * flight_times);
            let remain_times = flight_times - reputation_times - ecoFriendly_times;
            const ability_f = Math.floor(capacity / 3) * (default_proportion + airline_reputation + eco_friendly_proportion) * reputation_times +
                Math.floor(capacity / 3) * (default_proportion + eco_friendly_proportion) * ecoFriendly_times +
                Math.floor(capacity / 3) * default_proportion * remain_times;
            if(ability_f < demand_f) { // case all first
                seat_allocation.First = Math.floor(capacity / 3);
                seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
                seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
            } else { // case first and others
                const first = Math.floor(demand_f / (reputation_times * (default_proportion + airline_reputation +
                    eco_friendly_proportion) + ecoFriendly_times * (default_proportion + eco_friendly_proportion) +
                    remain_times * default_proportion));
                let remain_seat = capacity - first * 3;
                const remain_ability_b = Math.floor(remain_seat / 2) * (default_proportion + airline_reputation + eco_friendly_proportion) * reputation_times +
                    Math.floor(remain_seat / 2) * (default_proportion + eco_friendly_proportion) * ecoFriendly_times +
                    Math.floor(remain_seat / 2) * default_proportion * remain_times;
                if(remain_ability_b < demand_b) { // case all first and business
                    const business = Math.floor(remain_seat / 2);
                    seat_allocation.Economy = remain_seat - business * 2;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                } else { // case first, business, and others
                    const business = Math.floor(demand_b / (reputation_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        ecoFriendly_times * (default_proportion + eco_friendly_proportion) + remain_times * default_proportion));
                    remain_seat = remain_seat - business * 2;
                    seat_allocation.Economy = remain_seat;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                    const remain_ability_e = remain_seat * reputation_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        remain_seat * ecoFriendly_times * (default_proportion + eco_friendly_proportion) +
                        remain_seat * remain_times * default_proportion;
                    if(remain_ability_e > demand_e) {
                        seat_allocation.TooBig = "Yes";
                    }
                }
            }
        } else if(reputation_duration > ecoFriendly_duration) {
            let ecoFriendly_times = Math.ceil(ecoFriendly_duration / active_hour * flight_times);
            let reputation_times = Math.ceil((reputation_duration - ecoFriendly_duration) / active_hour * flight_times);
            let remain_times = flight_times - reputation_times - ecoFriendly_times;
            const ability_f = Math.floor(capacity / 3) * (default_proportion + airline_reputation + eco_friendly_proportion) * ecoFriendly_times +
                Math.floor(capacity / 3) * (default_proportion + airline_reputation) * reputation_times +
                Math.floor(capacity / 3) * default_proportion * remain_times;
            if(ability_f < demand_f) { // case all first
                seat_allocation.First = Math.floor(capacity / 3);
                seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
                seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
            } else { // case first and others
                const first = Math.floor(demand_f / (ecoFriendly_times * (default_proportion + airline_reputation +
                        eco_friendly_proportion) + reputation_times * (default_proportion + airline_reputation) +
                    remain_times * default_proportion));
                let remain_seat = capacity - first * 3;
                const remain_ability_b = Math.floor(remain_seat / 2) * (default_proportion + airline_reputation + eco_friendly_proportion) * ecoFriendly_times +
                    Math.floor(remain_seat / 2) * (default_proportion + airline_reputation) * reputation_times +
                    Math.floor(remain_seat / 2) * default_proportion * remain_times;
                if(remain_ability_b < demand_b) { // case all first and business
                    const business = Math.floor(remain_seat / 2);
                    seat_allocation.Economy = remain_seat - business * 2;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                } else { // case first, business, and others
                    const business = Math.floor(demand_b / (ecoFriendly_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        reputation_times * (default_proportion + airline_reputation) + remain_times * default_proportion));
                    remain_seat = remain_seat - business * 2;
                    seat_allocation.Economy = remain_seat;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                    const remain_ability_e = remain_seat * ecoFriendly_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        remain_seat * reputation_times * (default_proportion + airline_reputation) +
                        remain_seat * remain_times * default_proportion;
                    if(remain_ability_e > demand_e) {
                        seat_allocation.TooBig = "Yes";
                    }
                }
            }
        } else { // case reputation_duration === ecoFriendly_duration
            let increased_proportion_times = Math.ceil(ecoFriendly_duration / active_hour * flight_times);
            let remain_times = flight_times - increased_proportion_times;
            const ability_f = Math.floor(capacity / 3) * (default_proportion + airline_reputation + eco_friendly_proportion) * increased_proportion_times +
                Math.floor(capacity / 3) * default_proportion * remain_times;
            if(ability_f < demand_f) { // case all first
                seat_allocation.First = Math.floor(capacity / 3);
                seat_allocation.Business = Math.floor((capacity - (seat_allocation.First * 3)) / 2);
                seat_allocation.Economy = capacity - (seat_allocation.First * 3) - (seat_allocation.Business * 2);
            } else { // case first and others
                const first = Math.floor(demand_f / (increased_proportion_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                    remain_times * default_proportion));
                let remain_seat = capacity - first * 3;
                const remain_ability_b = Math.floor(remain_seat / 2) * (default_proportion + airline_reputation + eco_friendly_proportion) * increased_proportion_times +
                    Math.floor(remain_seat / 2) * default_proportion * remain_times;
                if(remain_ability_b < demand_b) { // case all first and business
                    const business = Math.floor(remain_seat / 2);
                    seat_allocation.Economy = remain_seat - business * 2;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                } else { // case first, business, and others
                    const business = Math.floor(demand_b / (increased_proportion_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        remain_times * default_proportion));
                    remain_seat = remain_seat - business * 2;
                    seat_allocation.Economy = remain_seat;
                    seat_allocation.Business = business;
                    seat_allocation.First = first;
                    const remain_ability_e = remain_seat * increased_proportion_times * (default_proportion + airline_reputation + eco_friendly_proportion) +
                        remain_seat * remain_times * default_proportion;
                    if(remain_ability_e > demand_e) {
                        seat_allocation.TooBig = "Yes";
                    }
                }
            }
        }
    }
    return seat_allocation;
}

export function getPrice(distance) {
    let data = Ticket.data;
    let pre = null;
    let next = null;
    let a, b;
    for(let i = 0; i < data.length; i++) {
        if(parseInt(data[i].distance) < distance) {
            pre = i;
        } else {
            next = i;
            break;
        }
    }
    if(!pre) { // shorter than all samples
        pre = 0;
        next = 1;
    }
    if(!next) { // longer than all samples
        pre = data.length - 2;
        next = data.length - 1;
    }

    // calculate ticket price, formula ax + b = y
    // calculate economy class ticket
    a = (parseInt(data[next].price_e) - parseInt(data[pre].price_e)) / (parseInt(data[next].distance) - parseInt(data[pre].distance));
    b = parseInt(data[pre].price_e) - a * parseInt(data[pre].distance);
    let price_e = a * distance + b;

    // calculate business class ticket
    a = (parseInt(data[next].price_b) - parseInt(data[pre].price_b)) / (parseInt(data[next].distance) - parseInt(data[pre].distance));
    b = parseInt(data[pre].price_b) - a * parseInt(data[pre].distance);
    let price_b = a * distance + b;

    // calculate first class ticket
    a = (parseInt(data[next].price_f) - parseInt(data[pre].price_f)) / (parseInt(data[next].distance) - parseInt(data[pre].distance));
    b = parseInt(data[pre].price_f) - a * parseInt(data[pre].distance);
    let price_f = a * distance + b;

    return {
        "economy": Math.floor(price_e),
        "business": Math.floor(price_b),
        "first": Math.floor(price_f)
    }
}

export function getDailyPax(seatAllocation_result, airline_reputation, reputation_duration, ecoFriendly, range, aircraft) {
    let flightTimes = seatAllocation_result.flightTimes;
    if(range / aircraft.speed > 24) {
        flightTimes = 1;
    } else if(range / aircraft.speed > 12) {
        flightTimes = 1.5;
    }

    const seat_e = seatAllocation_result.Economy;
    const seat_b = seatAllocation_result.Business;
    const seat_f = seatAllocation_result.First;
    const seat_total = seat_e + seat_b + seat_f;

    let ecoFriendly_duration;
    switch (ecoFriendly){
        case 1: ecoFriendly_duration = 12; break;
        case 2: ecoFriendly_duration = active_hour; break;
        default: ecoFriendly_duration = 0;
    }

    let dailyPax = 0;
    if(reputation_duration < ecoFriendly_duration) {
        const reputation_co2_times = flightTimes * Math.round((reputation_duration / active_hour));
        dailyPax += reputation_co2_times * Math.floor((default_proportion + airline_reputation + eco_friendly_proportion) * seat_total);

        const co2_times = flightTimes * Math.round((ecoFriendly_duration / active_hour));
        dailyPax += co2_times * Math.floor((default_proportion + eco_friendly_proportion) * seat_total);

        const remain_times = flightTimes - reputation_co2_times - co2_times;
        dailyPax += remain_times * Math.floor(default_proportion * seat_total);

    } else if(reputation_duration > ecoFriendly_duration) {
        const reputation_co2_times = flightTimes * Math.round((ecoFriendly_duration / active_hour));
        dailyPax += reputation_co2_times * Math.floor((default_proportion + airline_reputation + eco_friendly_proportion) * seat_total);

        const reputation_times = flightTimes * Math.round((reputation_duration / active_hour));
        dailyPax += reputation_times * Math.floor((default_proportion + airline_reputation) * seat_total);

        const remain_times = flightTimes - reputation_co2_times - reputation_times;
        dailyPax += remain_times * Math.floor(default_proportion * seat_total);

    } else { // reputation_duration === ecoFriendly_duration
        const reputation_co2_times = flightTimes * Math.round((reputation_duration / active_hour));
        dailyPax += reputation_co2_times * Math.floor((default_proportion + airline_reputation + eco_friendly_proportion) * seat_total);

        const remain_times = flightTimes - reputation_co2_times;
        dailyPax += remain_times * Math.floor(default_proportion * seat_total);
    }

    return dailyPax;
}

export function getEachFlightSeatPax(seatAllocation_result, dailyPax, range, aircraft) {
    let flightTimes = seatAllocation_result.flightTimes;
    if(range / aircraft.speed > 24) {
        flightTimes = 1;
    } else if(range / aircraft.speed > 12) {
        flightTimes = 1.5;
    }
    const seat_e = seatAllocation_result.Economy;
    const seat_b = seatAllocation_result.Business;
    const seat_f = seatAllocation_result.First;
    const seat_total = seat_e + seat_b + seat_f;
    const flightPax = dailyPax / flightTimes;
    return {
        pax_e: Math.floor(flightPax * (seat_e / seat_total)),
        pax_b: Math.floor(flightPax * (seat_b / seat_total)),
        pax_f: Math.floor(flightPax * (seat_f / seat_total))
    }
}
