export default {
    namespaced: true,
    state: {
        frequently: 0,
        fuel: 500
    },
    mutations: {
        setFrequently(state, payload) {
            state.frequently = payload;
        },
        setFuel(state, payload) {
            state.fuel = payload;
        }
    }
}
