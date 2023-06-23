import Vue from "vue";
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

import {
    faCircleInfo,
    faPlaneDeparture,
    faMoneyBill,
    faGasPump,
    faSackDollar,
    faLeaf
} from '@fortawesome/free-solid-svg-icons';

library.add(faCircleInfo);
library.add(faPlaneDeparture);
library.add(faMoneyBill);
library.add(faGasPump);
library.add(faSackDollar);
library.add(faLeaf);

Vue.component('font-awesome-icon', FontAwesomeIcon);
