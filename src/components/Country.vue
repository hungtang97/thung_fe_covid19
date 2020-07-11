<template>
  <div class="hello">
    <div id="app">
      <div class="contentWrapper">
      <h1>{{ countrySearchCode }}</h1>
      <h1>{{ $route.params }}</h1>
      <button @click="getSortByField">click</button>
        <h1 class="center">Covid19 Tracker 2020</h1>

        <div class="break-line"></div>

        <section class="search-covid">
          <input class="search-covid-input" v-model="searchCountry" placeholder="search..." value="" />
          <button class="search-covid-button" @click="handleClickSearchCountry">Search</button>
        </section>

        <div class="break-line"></div>

        <p v-if="country">Last updated:  {{this.country.Date}}</p>
        <h1 v-if="country">{{ this.country.Country }}</h1>

        <section class="summary" v-if="country">
          <div>
            <div>
              <p class="text-slim orange">Total Cases</p>
              <p class="text-bold orange numLabel">{{country.Confirmed}}</p>
            </div>

            <div>
              <p class="text-slim orange">Total treatment</p>
              <p class="text-bold orange numLabel">{{country.Confirmed - (country.Recovered + country.Deaths)}}</p>
            </div>
          </div>

          <div>
            <div>
              <p class="text-slim blue">Total Recovered</p>
              <p class="text-bold blue numLabel">{{country.Recovered}}</p>
            </div>

            <div>
              <p class="text-slim blue">Total Deaths</p>
              <p class="text-bold blue numLabel">{{country.Deaths}}</p>
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
              <line-example
                :countrySearchCode="countrySearchCode"
                :confirmedData="confirmedData"
                :recoveredData="recoveredData"
                :deathsData="deathsData"
                :dateData="dateData"
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
import LineExample from './charts/LineExample'

export default {
  components: {
    LineExample
  },
  name: 'Covid',
  data () {
    return {
      countrySearchCode: '',
      searchCountry: '',
      summary: null,
      global: null,
      country: null,
      countriesList: [],
      countriesListLimit30: [],
      topTen: null,
      labelSort: ['TotalConfirmed', 'TotalRecovered', 'TotalDeaths'],
      labelCharBar: ['Total Confirmed', 'Total Recovered', 'Total Deaths'],
      labelConfirmed: [],
      labelRecovered: [],
      labelDeaths: [],
      confirmedData: [],
      recoveredData: [],
      deathsData: [],
      dateData: []
    }
  },
  methods: {
    getCountries (data) {
      this.countries = data.Countries
    },
    async getSummary () {
      fetch('https://api.covid19api.com/total/dayone/country/south-africa', {
        mode: 'cors',
        method: 'GET',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(res => res.json())
        .then(
          (result) => {
            if (result.length > 0) {
              this.summary = result
              this.country = result[result.length - 1]
              this.countriesListLimit30 = result.splice(result.length - 60, result.length - 1)
            }
            // this.summary = result
            // this.global = result.Global
            // this.getCountries(result)
            // if (this.countriesList.length === 0) {
            //   this.getCountriesList(result.Countries)
            // }

            this.countriesListLimit30.forEach((country) => {
              this.confirmedData.push(country.Confirmed)
              this.recoveredData.push(country.Recovered)
              this.deathsData.push(country.Deaths)
              this.dateData.push(country.Date)
            })
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
      // var aa = $('#searchCountry').val()
      console.log('aa -->', this.searchCountry)
    }
  },
  mounted: function () {
    this.getSummary()
    this.countrySearchCode = this.$route.params.country
  }
}
</script>

<style>
  @import '../assets/styles.scss'
</style>
