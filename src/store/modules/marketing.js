export default {
    namespaced: true,
    state: {
        airlineReputation: 0,
        reputationDuration: 0,
        ecoFriendly: 0
    },
    mutations: {
        setAirlineReputation(state, payload) {
            state.airlineReputation = payload;
        },
        setReputationDuration(state, payload) {
            state.reputationDuration = payload;
        },
        setEcoFriendly(state, payload) {
            state.ecoFriendly = payload;
        }
    }
}
