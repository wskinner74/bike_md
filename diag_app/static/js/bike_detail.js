function getCookie(name) {
   var cookieValue = null;
   if (document.cookie && document.cookie !== '') {
       var cookies = document.cookie.split(';');
       for (var i = 0; i < cookies.length; i++) {
           var cookie = jQuery.trim(cookies[i]);
           if (cookie.substring(0, name.length + 1) === (name + '=')) {
               cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
               break;
           }
       }
   }
   return cookieValue;
}


var csrftoken = getCookie('csrftoken');
function csrfSafeMethod(method) {
   return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});


// get current url
function currentURL(){
    var url = window.location.href
    showBike(url)

}
currentURL()


// get bike details
function showBike(url){
    var id = url.split('/')
    id = id[5]
    var url = '/api/models/' + id
    $.ajax({
        url: url,
        type: 'GET',
    }).done(function(results){
        var source = $("#bike-template").html()
        var template = Handlebars.compile(source)
        var html = template(results)
        $("#bikeSpecs").append(html)

    })
}


// load systems
function loadSystems(){
    $.ajax({
        url: '/api/systems/',
        type: 'GET',
    }).done(function(results){
        console.log(results)
        var source = $('#system-template').html()
        var template = Handlebars.compile(source)
        var html = template(results.results)
        $('#system').append(html)
    })
}
loadSystems()


// post new problem
function postProblem(){
    var sys =  $("#probSystem option:selected").val()
    var text = $("#probText").val()
    var user = $("#userId").val()
    var bike = $("#bikeId").val()
    var header = $("#probTitle").val()
    var context = {
        system: sys,
        description: text,
        tech: user,
        model: bike,
        title: header,
    }
    $.ajax({
        url: '/api/post-problems/',
        type: 'POST',
        data: context,
    }).done(function(results){
        console.log(results)
    })
}

$("#newProbSubmit").click(postProblem)