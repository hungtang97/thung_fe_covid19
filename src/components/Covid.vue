<template>
  <div class="hello">
    <div id="app">
      <div class="contentWrapper">
        <h1 class="center">Covid19 Tracker 2020</h1>

        <div class="break-line"></div>

        <section class="search-covid">
          <input
            class="search-covid-input"
            v-model="searchCountry"
            placeholder="search..."
            value=""
            @keyup.enter="handleClickSearchCountry"
          />
          <button class="search-covid-button" @click="handleClickSearchCountry">Search</button>
        </section>

        <div class="break-line"></div>

        <p>Last updated:  {{new Date().toLocaleString()}}</p>
        <h1>World Wide</h1>

        <section class="summary" v-if="global">
          <div>
            <div>
              <p class="text-slim orange">Total Cases</p>
              <p class="text-bold orange numLabel">{{global.TotalConfirmed}}</p>
            </div>

            <div>
              <p class="text-slim orange">Total treatment</p>
              <p class="text-bold orange numLabel">{{global.TotalConfirmed - (global.TotalRecovered + global.TotalDeaths)}}</p>
            </div>
          </div>

          <div>
            <div>
              <p class="text-slim blue">Total Recovered</p>
              <p class="text-bold blue numLabel">{{global.TotalRecovered}}</p>
            </div>

            <div>
              <p class="text-slim blue">Total Deaths</p>
              <p class="text-bold blue numLabel">{{global.TotalDeaths}}</p>
            </div>
          </div>
        </section>

        <div class="break-line"></div>

        <section class="daily-total">
          <p class="text-gray title text-bold">
            What are the daily totals?
          </p>
          <div class="chart-wrapper" v-if="labelConfirmed.length > 0">
            <div class="chart">
              <bar-example
                :labelCharBar="labelCharBar[0]"
                :labelCountries="labelConfirmed"
                :dataCountries="confirmedData"
              />
            </div>
            <div class="chart">
              <bar-example
                :labelCharBar="labelCharBar[1]"
                :labelCountries="labelRecovered"
                :dataCountries="recoveredData"
              />
            </div>
            <div class="chart">
              <bar-example
                :labelCharBar="labelCharBar[2]"
                :labelCountries="labelDeaths"
                :dataCountries="deathsData"
              />
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

export default {
  components: {
    BarExample
  },
  name: 'Covid',
  data () {
    return {
      msg: 'Welcome to Hung App',
      searchCountry: '',
      summary: null,
      global: null,
      countries: null,
      countriesList: [],
      topTen: null,
      labelSort: ['TotalConfirmed', 'TotalRecovered', 'TotalDeaths'],
      labelCharBar: ['Total Confirmed', 'Total Recovered', 'Total Deaths'],
      labelConfirmed: [],
      labelRecovered: [],
      labelDeaths: [],
      confirmedData: [],
      recoveredData: [],
      deathsData: []
    }
  },
  methods: {
    getCountries (data) {
      this.countries = data.Countries
    },
    async getSummary () {
      fetch('https://api.covid19api.com/summary', {
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
            this.labelSort.forEach((lable, index) => {
              this.topTen = this.sortByField(result.Countries, lable).splice(0, 10)
              this.getDataChartBar(this.topTen, index)
            })

            if (this.countriesList.length === 0) {
              this.getCountriesList(result.Countries)
            }
          }
        )
        .catch(err => {
          throw err
        })
    },
    sortByField (data, field) {
      return data.sort((country1, country2) => {
        return country2[field] - country1[field]
      })
    },
    getSortByField (data, field) {
      this.topTen = this.sortByField(data, field)
    },
    getDataChartBar (topTen, index) {
      if (topTen && topTen.length > 0) {
        topTen.forEach((country) => {
          switch (index) {
            case 0:
              this.labelConfirmed.push(country.Country)
              this.confirmedData.push(country.TotalConfirmed)
              break
            case 1:
              this.labelRecovered.push(country.Country)
              this.recoveredData.push(country.TotalRecovered)
              break
            case 2:
              this.labelDeaths.push(country.Country)
              this.deathsData.push(country.TotalDeaths)
              break
            default:
              break
          }
        })
      }
    },
    getCountriesList (countries) {
      if (countries && countries.length > 0) {
        countries.forEach((country) => {
          this.countriesList.push(country.Country)
        })
      }
    },
    handleClickSearchCountry () {
      if (this.searchCountry.length > 0) {
        this.$router.push(`/covid/${this.searchCountry}`)
      }
    }
  },
  mounted: function () {
    this.getSummary()
  }
}
</script>

<style>
  @import '../assets/styles.scss';
</style>
