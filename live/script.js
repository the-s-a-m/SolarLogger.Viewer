
$(document).ready(function() {
  jQuery.getJSON('../requests.php?timerange=day', null).done(createDayStatistic);

  function createDayStatistic(responseRows) {
    var kwh = [];
    var iDC = [];
    var temperature = [];
    var powerAC = [];

    var voltageDC = [];
    var currencyDC = [];
    var currencyAC = [];
    var currentPAC = [];

    //LastRow
    var row = responseRows[responseRows.length - 1];
    var date = row.requesttime.substring(0, 11);
    var time = row.requesttime.substring(11);

    var devices = row.devices;
    var kwhDayTot = 0;
    var kwhMonthTot = 0;
    var kwhYearTot = 0;
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
            kwhDayTot += v;
        } else if(k == "TEMPERATURE_MAXIMUM") {
            tempTot += v;
        } else if(k == "P_AC") {
            powerACTot += v;
        } else if(k == "ENERGY_MONTH") {
            kwhMonthTot += v;
        } else if(k == "ENERGY_YEAR") {
            kwhYearTot += v;
        } else if(k == "ENERGY_TOTAL") {
            kwhTot += v;
        }

        var notI = (k == "device" || k.indexOf("U_AC_10_MIN_MEAN") !== -1
            || k.indexOf("ENERGY_") !== -1 || k.indexOf("TEMPERATURE_MAXIMUM") !== -1);

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

    $('#date').text(date);
    $('#time').text(time);

    $('#kwh-today').text(kwhDayTot);
    $('#kw-ac').text(powerACTot / 1000);
    $('#temperature').text(tempTot / devices.length);
    $('#kwh-month').text(kwhMonthTot);
    $('#kwh-year').text(kwhYearTot);
    $('#kwh-total').text(kwhTot);
  }
});