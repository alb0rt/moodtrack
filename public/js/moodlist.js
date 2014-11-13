var lml = document.getElementById("local_moodList");
var lm1 = lml.innerHTML;

    var ratings = [];
    var dates = [];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var weeks = new Array(52);
    var thisweek = 0;

    for(var i = 0; i < local_moodList.length; i++) {
      ratings[i] = local_moodList[i].rating;
      dates[i] = local_moodList[i].month + "/" + local_moodList[i].day + "/" + local_moodList[i].year;
      if(weeks[local_moodList[i].week] == null) {
        weeks[local_moodList[i].week] = new Array(7);
        thisweek = local_moodList[i].week;
      }
      
      weeks[local_moodList[i].week][local_moodList[i].dayOfWeek-1] = local_moodList[i].rating;

    }
    
    var allData = {
      labels : dates,
      datasets : [
        {
          fillColor : "rgba(172,194,132,0.4)",
          strokeColor : "#ACC26D",
          pointColor : "#fff",
          pointStrokeColor : "#9DB86D",
          data : ratings
        }
      ]
    }

    var weekDataset = [];
    var counter = 0;

    for(var i = thisweek; i > thisweek-3; i--) {
      if(weeks[i] != null) {
        weekDataset[counter] = {
          label : "Week " + i, 
          fillColor : "rgba(" + Math.floor(255*Math.random()) + "," + Math.floor(255*Math.random()) + "," + Math.floor(255*Math.random()) + ",0.5)",
          strokeColor : "#ACC26D",
          pointColor : "#fff",
          pointStrokeColor : "#9DB86D",
          data : weeks[i]
        }
        counter++;
      }
    }

    var weekData = {
      labels : days,
      datasets : weekDataset
    }

    // create array of arrays per week


    var mychart = document.getElementById('mychart').getContext('2d');
    new Chart(mychart).Line(allData, {scaleOverride : true, scaleSteps : 6, scaleStepWidth : 1, scaleStartValue : 0});
    var weekchart = document.getElementById('weekchart').getContext('2d');
    new Chart(weekchart).Line(weekData, {multiTooltipTemplate: "<%= datasetLabel %> - <%= value %>", scaleOverride : true, scaleSteps : 6, scaleStepWidth : 1, scaleStartValue : 0});

