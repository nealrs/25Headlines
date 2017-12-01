$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam");

  // length triggers y - long, o - too long, r - max
  y=$('#len1').text(); yc="#f1c40f";
  o=$('#len2').text(); oc="#e67e22";
  r=$('#len3').text(); rc="#E74C3C";
  sc="repeating-linear-gradient(45deg, #DDDDDD, #DDDDDD 10px, #f1c40f 10px, #f1c40f 20px";
  $('input').attr('maxlength', r); tc="transparent";

  // restore form data -- if available & recheck triggers!
  getData();

  // debounced keyup handler for color checking & autosaving to localStorage
  $('.hl').on('keyup', _.debounce(function (e) {
    colorCheck($(this));
    saveData();
  }, 100));

  // un-debounced keyup handler for character counting
  $('.hl').on('keyup', function(){
    $(this).next(".count")[0].innerText = $(this).val().length;
  });

  // handler for reset button
  $("#reset").on('click', function(){
    $('form')[0].reset();
    clearData();
  });

  // handler for download button
  $("#download").on('click', function(){
    // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

    var pl=new Date().toLocaleString()+" | 25 Headlines | Made by Neal Shyam (nealshyam.com)\n\n";
    $('.hl').each(function(k,v){
      pl += v.value+"\n";
    });

    var dl = document.createElement('a');
    dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pl));
    dl.setAttribute('download', "25Headlines_Export.txt");
    dl.click();
  });

});

// handler for share button
$("#share").on('click', function(){
  //console.log('share click');

  // return ID of new firebase location & redirect page to template / with new path? nealrs.github.io/25Headlines/v?id=123456789
  //console.log("data located at:" + share());
  share();
});

// length based color checking
function colorCheck(e){
  if (e.val().length >= y && e.val().length < o){
    e.css("background", yc);
  }
  if (e.val().length >= o){
    e.css("background", oc);
  }
  if (e.val().length >= r){
    e.css("background", rc);
  }
  if (e.val().length < y){
    e.css("background", tc);
  }
  if ( $('#contentType').text() == "Subject lines" && spammy( " "+e.val()+" " ) ){
    e.css("background", sc);
  }
}

function colorCheckAll(){
  $('.hl').each(function(k,v){
    colorCheck($(this));
  });
}

jQuery.fn.serializeObject = function () {
  var formData = {};
  var formArray = this.serializeArray();

  for(var i = 0, n = formArray.length; i < n; ++i)
    formData[formArray[i].name] = formArray[i].value;

    return formData;
  };

// save form data to localstorage
function saveData(){
  var data = $('#form').serializeObject();
  //console.log(data);

  if( $('#contentType').text() == "Headlines" ){
    localStorage.setItem('dataH', JSON.stringify(data));
  }
  else if ( $('#contentType').text() == "Tweets" ){
    localStorage.setItem('dataT', JSON.stringify(data));
  }
  else if ( $('#contentType').text() == "Subject lines" ){
    localStorage.setItem('dataE', JSON.stringify(data));
  }
}

// restore form data & app state from localstorage
function getData(){

  if( $('#contentType').text() == "Headlines" ){
    data = JSON.parse(localStorage.getItem('dataH'));
  }
  else if ( $('#contentType').text() == "Tweets" ){
    data = JSON.parse(localStorage.getItem('dataT'));
  }
  else if ( $('#contentType').text() == "Subject lines" ){
    data = JSON.parse(localStorage.getItem('dataE'));
  }

  if (data){
    $('.hl').each(function(k,v){
      v.value = data["h"+(k+1)];
      $(this).next(".count")[0].innerText = $(this).val().length;

    });
    colorCheckAll();
  } //else {console.log("womp womp - no data here.");}
}

// reset form data & localstorage & app state.
function clearData(){
  localStorage.clear();
  colorCheckAll();
  $(".count").each(function(k,v){
    v.innerText="0";
  });
}

// fullscreen helpers

var tog=0;
function launchIntoFullscreen(element) {
  if(element.requestFullscreen) {
    element.requestFullscreen();
    tog=1;
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
    tog=1;
  } else if(element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen();
    tog=1;
  } else if(element.msRequestFullscreen) {
    element.msRequestFullscreen();
    tog=1;
  }
}

function exitFullscreen() {
  if(document.exitFullscreen) {
    document.exitFullscreen();
    tog=0;
  } else if(document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
    tog=0;
  } else if(document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
    tog=0;
  }
}

// keyboard shortcuts
// Shift-H - headlines
// Shift-T - tweets
// Shift-E - email subject lines
// ? - help
// Shift-F - fullscreen toggle

Mousetrap.bind('shift F', function() {
  console.log('FullScreen Toggle');

  if (tog!==0){
    console.log("exit fs");
    exitFullscreen();
  } else {
      console.log("launch fs");
      launchIntoFullscreen(document.documentElement);
    }
  $("#subHead").toggleClass("hide");
  $("#credit").toggleClass("hide");


});

// Export & Save data to Firebase for sharing (future: alert & don't export if array is empty) (or just hide the button????)
function share() {
  var data = $('#form').serializeObject();
  data.type = $('#contentType').text();
  data.timestamp = Firebase.ServerValue.TIMESTAMP;

  var fbl = new Firebase('https://25h.firebaseio.com/data');
  var l = fbl.push(data);
  var id = (l.toString()).replace(/(.*?)data\//, ""); // id of firebase location
  // redirect to viewonly page.
  var myTimer = window.setTimeout(function() {
    //window.open("/v/index.html?id="+id); // localhost only?
    window.open("v/?id="+id); // works on github.
  }, 500);
}