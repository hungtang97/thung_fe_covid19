import Vue from 'vue'
import Router from 'vue-router'
import Covid from '@/components/Covid'
import Country from '@/components/Country'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'CovidHome',
      component: Covid
    },
    {
      path: '/covid',
      name: 'Covid',
      component: Covid
    },
    {
      path: '/covid/:country',
      name: 'Country',
      component: Country
    }
  ]
})
