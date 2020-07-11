<template>
  <div class="hello">
    <div id="app">
      <div class="contentWrapper">
      <h1>{{ global }}</h1>
      <button @click="getSortByField">click</button>
        <h1 class="center">Covid19 Tracker 2020</h1>

        <div class="break-line"></div>

        <section class="search-covid">
          <input class="search-covid-input" placeholder="search..." value="" />
          <button class="search-covid-button">Search</button>
        </section>

        <div class="break-line"></div>

        <p>June 1 - July 10, 2020</p>
        <h1>World Wide</h1>

        <section class="summary">
          <div>
            <div>
              <p class="text-slim orange">Total Cases</p>
              <p class="text-bold orange numLabel">1,234,235</p>
            </div>

            <div>
              <p class="text-slim orange">Total treatment</p>
              <p class="text-bold orange numLabel">1,234,235</p>
            </div>
          </div>

          <div>
            <div>
              <p class="text-slim blue">Total Recovered</p>
              <p class="text-bold blue numLabel">1,234,235</p>
            </div>

            <div>
              <p class="text-slim blue">Total Deaths</p>
              <p class="text-bold blue numLabel">1,234,235</p>
            </div>
          </div>
        </section>

        <div class="break-line"></div>

        <section class="daily-total">
          <p class="text-gray title text-bold">
            What are the daily totals?
          </p>
          <div class="chart-wrapper">
            <div class="chart">
              <bar-example />
            </div>
            <div class="chart">
              <bar-example />
            </div>
          </div>
        </section>

        <div class="break-line"></div>

        <section class="top-ten">
          <p class="text-gray title text-bold">
            Where are the virus spreading the fastest?
          </p>
          <div class="chart-wrapper">
            <div class="chart">
              <p class="text-gray">Chart 1 here</p>
            </div>
            <div class="chart">
              <p class="text-gray">Chart 2 here</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import BarExample from './charts/BarExample'
import VueApexCharts from 'vue-apexcharts'
Vue.use(VueApexCharts)

Vue.component('apexchart', VueApexCharts)

export default {
  components: {
    BarExample
  },
  name: 'Covid',
  data () {
    return {
      msg: 'Welcome to Hung App',
      summary: null,
      global: null,
      countries: null,
      topTen: null,
    }
  },
  methods: {
    getCountries(data) {
      this.countries = data.Countries
      console.log("getCountries--->",this.countries)
      console.log("data--->",data)

    },
    async getSummary() {
      fetch("https://api.covid19api.com/summary", {
        mode: 'cors',
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(res => res.json())
        .then(
          (result) => {
            this.summary = result
            this.global = result.Global
            this.getCountries(result)
            this.getSortByField(result.Countries, "TotalDeaths")
          },
        )
        .catch(err => {
          throw err
        })
    },
    sortByField (data, field) {
      return data.sort((country1, country2) => {
        return country2[field] - country1[field]
      });
    },
    getSortByField (data, field) {
      this.topTen = this.sortByField(this.countries, "TotalDeaths")
    }
  },
  mounted: function() {
    this.getSummary()
  }
}

</script>

<style>
  @import '../assets/styles.scss';
</style>