var currentDay = "requests.php?timerange=day";
var last30DaysMax = "requests.php?timerange=month";
var last12MonthMax = "requests.php?timerange=year";

$(document).ready(function() {
  //Show and hide of additional and in more detailed statistics
  $('input[type=radio]').change(function() {       
    $("#dayChartVoltageDC").hide();
    $("#dayChartCurrencyDC").hide();
    $("#dayChartCurrencyAC").hide();
    $("#dayChartCurrencyPowerAC").hide();

    if(this.value == "chartV_DC") {
      $("#dayChartVoltageDC").show();
    } else if(this.value == "chartI_DC") {
      $("#dayChartCurrencyDC").show();
    } else if(this.value == "chartI_AC") {
      $("#dayChartCurrencyAC").show();
    } else if(this.value == "chartP_AC") {
      $("#dayChartCurrencyPowerAC").show();
    }
  });

  /** GET request by url with callback */
  function httpGetAsync(theUrl, callback) {
    jQuery.getJSON(theUrl, null)
          .done(callback)
          .always(function(data) {
            //Enable to show response
            //console.log(JSON.stringify(data));
          });
  }

  /** 
   * Converts response result into statistics 1-4
   * Chart 1: Kwh, currencyDC and temperature
   * Chart 2: VoltageDC compare
   * Chart 3: CurrencyDC compare
   * Chart 4: CurrencyAC compare
   */
  function createDayStatistic(responseRows) {
    var times = [];

    var kwh = [];
    var iDC = [];
    var temperature = [];
    var powerAC = [];

    var voltageDC = [];
    var currencyDC = [];
    var currencyAC = [];
    var currentPAC = [];

    $.each(responseRows, function(key, row) {
      var time = row.requesttime.substring(11, 16);
      times.push(time);

      var devices = row.devices;
      var kwhTot = 0;
      var idcTot = 0;
      var tempTot = 0;
      var powerACTot = 0;
      $.each(devices, function(key, device) {
        $.each(device, function(k, v) {
          //Total data
          if(k.indexOf("I_DC_") !== -1) {
              idcTot += v;
          } else if(k == "ENERGY_DAY") {
              kwhTot += v;
          } else if(k == "TEMPERATURE_MAXIMUM") {
              tempTot += v;
          } else if(k == "P_AC") {
              powerACTot += v;
          }

          var notI = (k == "device" || k.indexOf("U_AC_10_MIN_MEAN") !== -1
              || k.indexOf("ENERGY_") !== -1 || k.indexOf("TEMPERATURE_MAXIMUM") !== -1);
          //VoltageDC value
          if(!(notI || k.indexOf("U_AC") !== -1 || k.indexOf("I_") !== -1 || k.indexOf("P_") !== -1)) {
            if(voltageDC[key + k] == undefined) {
              voltageDC[key + k] = {
                      label: key + k,
                      data: [],
                      backgroundColor: "rgba("+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+",0.4)",
                      hidden: false
                    };
            }
            voltageDC[key + k].data.push(v);
          }
          //CurrencyDC
          if(!(notI || k.indexOf("U_") !== -1 || k.indexOf("I_AC") !== -1 || k.indexOf("P_") !== -1)) {
            if(currencyDC[key + k] == undefined) {
              currencyDC[key + k] = {
                      label: key + k,
                      data: [],
                      backgroundColor: "rgba("+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+",0.4)",
                      hidden: false
                    };
            }
            currencyDC[key + k].data.push(v);
          }

          //currency AC
          if(!(notI || k.indexOf("U_") !== -1 || k.indexOf("I_DC") !== -1 || k.indexOf("P_") !== -1)) {
            if(currencyAC[key + k] == undefined) {
              currencyAC[key + k] = {
                      label: key + k,
                      data: [],
                      backgroundColor: "rgba("+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+",0.4)",
                      hidden: false
                    };
            }
            currencyAC[key + k].data.push(v);
          }

          //current kw AC
          if(!(notI || k.indexOf("U_") !== -1 || k.indexOf("I_") !== -1)) {
            if(currentPAC[key + k] == undefined) {
              currentPAC[key + k] = {
                      label: key + k,
                      data: [],
                      backgroundColor: "rgba("+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+",0.4)",
                      hidden: false
                    };
            }
            currentPAC[key + k].data.push(v);
          }
        });
      });
      kwh.push(kwhTot);
      iDC.push(idcTot);
      temperature.push(tempTot / devices.length);
      powerAC.push(powerACTot / 1000);
    });

    var ctxdayChart = document.getElementById('dayChart').getContext('2d');
      var dayChart = new Chart(ctxdayChart, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: 'kwh',
            data: kwh,
            backgroundColor: "rgba(255,153,40,0.4)"
          },{
            label: 'I_DC',
            data: iDC,
            backgroundColor: "rgba(255,255,0,0.6)"
          },{
            label: 'Temperature',
            data: temperature,
            backgroundColor: "rgba(0,0,255,0.4)"
          },{
            label: 'kw_AC',
            data: powerAC,
            backgroundColor: "rgba(255,0,0,0.9)"
          }]
        } 
      });

    var voltageDCVals = [];
    for (var key in voltageDC) {
      let value = voltageDC[key];
      voltageDCVals.push(value);
    }
    var ctxdayChartVoltageDC = document.getElementById('dayChartVoltageDC').getContext('2d');
    var dayChartVoltageDC = new Chart(ctxdayChartVoltageDC, {
      type: 'line',
      data: {
        labels: times,
        datasets: voltageDCVals
      }
    });

    var currencyDCVals = [];
    for (var key in currencyDC) {
      let value = currencyDC[key];
      currencyDCVals.push(value);
    }
    var ctxdayChartCurrencyDC = document.getElementById('dayChartCurrencyDC').getContext('2d');
    var dayChartCurrencyDC = new Chart(ctxdayChartCurrencyDC, {
      type: 'line',
      data: {
        labels: times,
        datasets: currencyDCVals
      }
    });

    var currencyACVals = [];
    for (var key in currencyAC) {
      let value = currencyAC[key];
      currencyACVals.push(value);
    }

    var ctxdayChartCurrencyAC = document.getElementById('dayChartCurrencyAC').getContext('2d');
    var dayChartCurrencyAC = new Chart(ctxdayChartCurrencyAC, {
      type: 'line',
      data: {
        labels: times,
        datasets: currencyACVals
      }
    });

    var currencyPowerACVals = [];
    for (var key in currentPAC) {
      let value = currentPAC[key];
      currencyPowerACVals.push(value);
    }

    var ctxdayChartCurrencyPowerAC = document.getElementById('dayChartCurrencyPowerAC').getContext('2d');
    var dayChartCurrencyPowerAC = new Chart(ctxdayChartCurrencyPowerAC, {
      type: 'line',
      data: {
        labels: times,
        datasets: currencyPowerACVals
      }
    });

    $("#dayChartVoltageDC").hide();
    $("#dayChartCurrencyDC").hide();
    $("#dayChartCurrencyAC").hide();
    $("#dayChartCurrencyPowerAC").hide();
  }

  /** 
   * Converts response result into statistics last 30 days
   * Chart: kwh per day compared with average
   */
  function createlast30DaysStatistic(responseRows) {
      var times = [];
      var kwh = [];
      var kwhAverage = 0;

      $.each(responseRows, function(key, row) {
        var time = row.requesttime.substring(0, 10);
        times.push(time);

        var devices = row.devices;
        var kwhTot = 0;
        var measurements = 0;

        $.each(devices, function(key, device) {
            $.each(device, function(k, v) {
                if(k == "ENERGY_DAY") {
                    kwhTot += v;
                } 
            });
        });
        kwh.push(kwhTot);
        kwhAverage += kwhTot;
      });

      kwhAverage /= times.length;
      var kwhAverageArr = Array(times.length).fill(kwhAverage);

      var ctx = document.getElementById('monthChart').getContext('2d');
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: times,
          datasets: [{
            label: 'kwh',
            data: kwh,
            backgroundColor: "rgba(255,153,40,0.4)"
          },{
            label: 'Average',
            data: kwhAverageArr,
            backgroundColor: "rgba(0,0,200,0.1)"
          }]
        }
      });
  }

  /** 
   * Converts response result into statistics of last 12 Month 
   * Chart: kwh per month compared with average per month
   */
  function createlast12MonthStatistic(responseRows) {
    var times = [];
    var kwh = [];
    var kwhAverage = 0;
    var kwhPerYear = [];

    $.each(responseRows, function(key, row) {
      var time = row.requesttime.substring(0, 10);
      var year = row.requesttime.substring(0, 4);
      var month = row.requesttime.substring(5, 7);
      times.push(time);

      var devices = row.devices;

      if(kwhPerYear[year] == undefined) {
        var startData = [];
        if(month != "01") {
          var startMonth = parseInt(month);
          startData = Array(startMonth - 1).fill(0);
        }
        var backgroundColor = "rgba("+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+","+Math.floor((Math.random() * 255) + 1)+",0.6)";
        if(year == new Date().getFullYear()){
          backgroundColor = "rgba(255,0,0,0.6)"
        }
        kwhPerYear[year] = {
                label: year,
                data: startData,
                backgroundColor: backgroundColor,
                hidden: false
              };
      }
      
      var kwhTot = 0;
      $.each(devices, function(key, device) {
        $.each(device, function(k, v) {
          if(k == "ENERGY_MONTH") {
              kwhTot += v;
          } 
        });
      });
      kwhPerYear[year].data.push(kwhTot);
      kwhAverage += kwhTot;
    });

    kwhAverage /= times.length;
    var kwhAverageArr = Array(12).fill(kwhAverage);

    kwhPerYear["Average"] = {
        label: 'Average',
        data: kwhAverageArr,
        backgroundColor: "rgba(0,0,200,0.2)",
        hidden: true
      }

    var kwhPerYearVals = [];
    for (var key in kwhPerYear) {
      let value = kwhPerYear[key];
      kwhPerYearVals.push(value);
    }
    //var monthOfYear = Array.from(Array(12).keys()).map((_, i) => i + 1);
    var monthOfYear = ['Jan.','Feb.','Mar.','Apr.','May','June','July','Aug.','Sept.','Oct.','Nov.','Dec.'];

    var ctx = document.getElementById('yearChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: monthOfYear,
        datasets: kwhPerYearVals
      }
    });
  }

  httpGetAsync(currentDay, createDayStatistic);
  httpGetAsync(last30DaysMax, createlast30DaysStatistic);
  httpGetAsync(last12MonthMax, createlast12MonthStatistic);


    /*
    //Google chart to compare month (Will be activated later when other year data exist)
    google.charts.load('current', {'packages':['bar']});
    google.charts.setOnLoadCallback(drawChart1);

    function drawChart1() {
      var data = google.visualization.arrayToDataTable([
        ['Month (in kw/h)', '2015', '2016', '2017'],
        ['Jan.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['Feb.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['Mar.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['Apr.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['May', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['June', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 500 + 300 * Math.random()],
        ['July', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0],
        ['Aug.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0],
        ['Sept.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0],
        ['Oct.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0],
        ['Nov.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0],
        ['Dec.', 500 + 300 * Math.random(), 500 + 300 * Math.random(), 0]
      ]);

      var options = {
        chart: {
          title: '',
          subtitle: ''
        },
        bars: 'vertical'
      };

      var chart = new google.charts.Bar(document.getElementById('barchart_material'));

      chart.draw(data, google.charts.Bar.convertOptions(options));
      
    }*/
});



