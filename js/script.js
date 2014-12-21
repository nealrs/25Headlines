/*
* To Title Case 2.1 – http://individed.com/code/to-title-case/
* Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
*/

String.prototype.toTitleCase = function(){
  var smallWords = /^(a|an|and|as|at|but|by|en|for|if|in|nor|of|on|or|per|the|to|vs?\.?|via)$/i;

  return this.replace(/[A-Za-z0-9\u00C0-\u00FF]+[^\s-]*/g, function(match, index, title){
    if (index > 0 && index + match.length !== title.length &&
      match.search(smallWords) > -1 && title.charAt(index - 2) !== ":" &&
      (title.charAt(index + match.length) !== '-' || title.charAt(index - 1) === '-') &&
      title.charAt(index - 1).search(/[^\s-]/) < 0) {
        return match.toLowerCase();
      }
      if (match.substr(1).search(/[A-Z]|\../) > -1) {
        return match;
      }
      return match.charAt(0).toUpperCase() + match.substr(1);
    });
  };

/*
Stack Overflow: http://stackoverflow.com/questions/19089442/convert-string-to-sentence-case-in-javascript
*/
String.prototype.toSentenceCase = function(){
  //var string="Hi All, This Is Derp. Thank You All to Answer My Query";
  var n=this.toLowerCase().split(".");
  var vfinal="";
  for(i=0;i<n.length;i++)
    {
      var spaceput="";
      var spaceCount=n[i].replace(/^(\s*).*$/,"$1").length;
      n[i]=n[i].replace(/^\s+/,"");
      var newstring=n[i].charAt(n[i]).toUpperCase() + n[i].slice(1);
      for(j=0;j<spaceCount;j++)
        spaceput=spaceput+" ";
        vfinal=vfinal+spaceput+newstring+".";
      }
      vfinal=vfinal.substring(0, vfinal.length - 1);
      vfinal=vfinal.replace(/(\si'\s)/, " I' ");
      vfinal=vfinal.replace(/(\si\s)/, " I ");

      console.log(vfinal);
      return vfinal;
};

/*------------And now, the stuff I actually wrote myself.-----------*/

$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam");
  //teaser();

  // length triggers y - long, o - too long, r - max
  hy=50; ho=62; hr=100; //headline
  ty=100; to=120; tr=140; //tweet
  ey=35; eo=40; er=50; //email

  y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
  yc="#f1c40f"; oc="#e67e22"; rc="#E74C3C"; tc="transparent";

  // restore form data -- if available & recheck triggers!
  getData();

  // debounced keyup handler for color checking & autosaving to localStorage
  $('.hl').on('keyup', _.debounce(function (e) {
    colorCheck($(this));
    saveData();
  }, 100));

  // onblur handler for title casing / sentence casing.
  $('.hl').on('blur', function(){
    // if it's a headline, use title case, otherwise use sentence case.
    if ( $("#selh").hasClass("sela") ){
      $(this).val($(this).val().toTitleCase());
      saveData();
    } else {
      $(this).val($(this).val().toSentenceCase());
      saveData();
    }
  });

  // un-debounced keyup handler for character counting
  $('.hl').on('keyup', function(){
    $(this).next(".count")[0].innerText = $(this).val().length;
  });

  // handler for content type switching. also changes char counts & re-runs colorCheck.
  $(".sel").on('click', function(){
    //teaser();
    $(".sel").removeClass("sela");
    $(this).addClass("sela");

    if ( $(this)[0].id == "selh" ){
      y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
      $('#len1').text(hy);
      $('#len2').text(ho);
      $('#len3').text(hr);
      $('#contentType').text("Headlines");

      // reapply title casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toTitleCase();
        }
      });
    }

    if ( $(this)[0].id == "selt" ){
      y=ty; o=to; r=tr; $('input').attr('maxlength', r);
      $('#len1').text(ty);
      $('#len2').text(to);
      $('#len3').text(tr);
      $('#contentType').text("Tweets");

      // reapply sentence casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toSentenceCase();
        }
      });
    }

    if ( $(this)[0].id == "sele" ){
      y=ey; o=eo; r=er; $('input').attr('maxlength', r);
      $('#len1').text(ey);
      $('#len2').text(eo);
      $('#len3').text(er);
      $('#contentType').text("Subject lines");

      // reapply sentence casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toSentenceCase();
        }
      });
    }

    // recheck all inputs against length triggers
    colorCheckAll();
  });

  // handler for reset button
  $("#reset").on('click', function(){
    $('form')[0].reset();
    clearData();
  });

  // handler for download button
  $("#download").on('click', function(){
    // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

    var pl=new Date().toLocaleString()+" | 25 Headlines | Made by Neal Shyam\n\n";
    $('.hl').each(function(k,v){
      pl += (k+1) +". "+ v.value+"\n";
    });

    var dl = document.createElement('a');
    dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pl));
    dl.setAttribute('download', "25Headlines.txt");
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
    e.css("background-color", yc);
  }
  if (e.val().length >= o){
    e.css("background-color", oc);
  }
  if (e.val().length >= r){
    e.css("background-color", rc);
  }
  if (e.val().length < y){
    e.css("background-color", tc);
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
  localStorage.setItem('data', JSON.stringify(data));
}

// restore form data & app state from localstorage
function getData(){
  var data = JSON.parse(localStorage.getItem('data'));
  //console.log(data);

  if (data){
    //console.log("ok, we found some data!");
    $('.hl').each(function(k,v){
      v.value = data["h"+(k+1)];
      $(this).next(".count")[0].innerText = $(this).val().length;

      //console.log(v.value);
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

/*
// teaser changer
function teaser(){
  t=[
  "You gotta kiss a few frogs, #amirite?",
  "The social juice is worth the squeeze.",
  "There's always another angle.",
  "Copywriters aren't born. They practice.",
  //"Practice your pitch for more clicks.",
  "They won't all be great, but one will."
  ];
  $("#teaser").text(t[Math.floor((Math.random() * t.length))]);
}
*/

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

// Export & Save data to Firebase for sharing (future: alery & don't export if array is empty) (or just hide the button????)
function share() {
  var data = $('#form').serializeObject();
  data.type = $('#contentType').text();
  data.timestamp = Firebase.ServerValue.TIMESTAMP;
  //console.log(data);

  var fbl = new Firebase('https://25h.firebaseio.com/data');
  var l = fbl.push(data);
  var id = (l.toString()).replace(/(.*?)data\//, ""); // id of firebase location
  //console.log(id);
  // redirect to viewonly page.
  var myTimer = window.setTimeout(function() {
    //window.open("/v/index.html?id="+id); // localhost only?
    window.open("v/?id="+id); // works on github.
  }, 500);
}
