<template>
  <div class="example">
    <apexchart width="500" height="350" type="bar" :options="chartOptions" :series="series"></apexchart>
     <div class="center">
       <b>Top Ten Countries Sort By {{labelCharBar}}</b>
    </div>
  </div>
</template>

<script>

export default {
  name: 'BarExample',
  props: ['labelCharBar', 'labelCountries', 'dataCountries'],
  data: function () {
    return {
      chartOptions: {
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        xaxis: {
          categories: this.labelCountries,
          labels: {
            style: {
              colors: 'white',
              fontSize: '13px'
            }
          }
        },
        yaxis: {
          labels: {
            style: {
              colors: 'white',
              fontSize: '13px'
            }
          }
        }
      },
      series: [{
        name: this.labelCharBar,
        data: this.dataCountries
      }]
    }
  },
  methods: {
  },
  mounted: function () {
    switch (this.labelCharBar) {
      case 'Total Confirmed':
        this.chartOptions = {
          colors: '#FEB019'
        }
        break
      case 'Total Recovered':
        this.chartOptions = {
          colors: '#00E396'
        }
        break
      case 'Total Deaths':
        this.chartOptions = {
          colors: '#775DD0'
        }
        break
      default:
        break
    }
  }
}
</script>
