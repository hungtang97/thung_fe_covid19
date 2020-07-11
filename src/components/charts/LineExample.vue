<template>
  <div class="example">
    <apexchart width="1000" height="350" type="line" :options="chartOptions" :series="series"></apexchart>
    <div class="center">
       <b>Detail In {{countrySearchCode}}</b>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LineExample',
  props: ['countrySearchCode', 'confirmedData', 'recoveredData', 'deathsData', 'dateData'],
  data: function () {
    return {
      chartOptions: {
        xaxis: {
          type: 'datetime',
          categories: this.dateData,
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
        name: 'confirmed',
        data: this.confirmedData
      }, {
        name: 'recovered',
        data: this.recoveredData
      }, {
        name: 'deaths',
        data: this.deathsData
      }]
    }
  },
  methods: {
  }
}
</script>
