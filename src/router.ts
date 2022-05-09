import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './components/Home.vue'
import AccountFilter from './components/AccountFilter.vue'
import AddressConverter from './components/AddressConverter.vue'
import DataConverter from './components/DataConverter.vue'
import CellSizeCalculator from './components/CellSizeCalculator.vue'
import EIP712Tester from './components/EIP712Tester.vue'

const routes = [
    { path: '/', component: Home },
    { path: '/account-filter', component: AccountFilter },
    { path: '/address-converter', component: AddressConverter },
    { path: '/data-converter', component: DataConverter },
    { path: '/cell-size-calculator', component: CellSizeCalculator },
    { path: '/eip712-tester', component: EIP712Tester },
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes,
})
