<template>
  <div class="hello">
    <div id="app">
      <div class="contentWrapper">
        <h1>{{ countrySearchCode }}</h1>
        <h1>{{ $route.params }}</h1>
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
        <h1 class="center" v-if="!summary">NOT FOUND</h1>
        <div v-if="summary">
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
            <div class="chart-wrapper" v-if="confirmedData.length > 0">
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
        </div>
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
      country: null,
      countriesListLimit30: [],
      confirmedData: [],
      recoveredData: [],
      deathsData: [],
      dateData: []
    }
  },
  methods: {
    async getSummary () {
      fetch(`https://api.covid19api.com/total/dayone/country/${this.countrySearchCode}`, {
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
            } else {
              this.summary = null
            }

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
    validationSearchCountry () {
      this.searchCountry = this.searchCountry.trim()
    },
    handleClickSearchCountry () {
      if (this.searchCountry.length > 0) {
        this.validationSearchCountry()

        const path = `/covid/${this.searchCountry}`
        if (this.$route.path !== path) this.$router.push(path)

        this.countrySearchCode = this.$route.params.country
        this.getSummary()
      }
    }
  },
  mounted: function () {
    this.countrySearchCode = this.$route.params.country
    this.getSummary()
  }
}
</script>

<style>
  @import '../assets/styles.scss';
</style>
