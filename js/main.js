function slugify(text)
{
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

$(function () {
  var template = _.template($('#page-template').html()),
      $content = $('#content');

  var getData = function () {
    var type = 'metro';
    var line = '5';
    var dest = 'Place d\'Italie';
    var station = 'Gare du Nord';
    var sens = 'A'
    console.log(slugify(station));

    var schedules_url = 'https://api-ratp.pierre-grimaud.fr/v4/schedules/' + type + 's/' + line + '/' + slugify(station) + '/A';
    var traffic_url   = 'https://api-ratp.pierre-grimaud.fr/v4/traffic/' + type +'s/' + line;

    $.when($.getJSON(schedules_url), $.getJSON(traffic_url)).done(function (schedules, traffic) {
      var date         = new Date(),
          hours        = date.getHours(),
          minutes      = date.getMinutes(),
          current_time = (hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes);

      var trafficResponse  = traffic[0].result,
          scheduleResponse = schedules[0].result;

      var data = {
        traffic     : trafficResponse.message,
        line        : line,
        type        : type,
        horaires    : scheduleResponse.schedules,
        destination : dest,
        station     : station,
        current_time: current_time
      };

      $content.html(template(data));
    });
  };

  getData();
  setInterval(getData, 20);
});
