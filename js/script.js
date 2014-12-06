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

/*------------And now, the stuff I actually wrote myself.-----------*/

$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam");
  teaser();

  // length triggers y - long, o - too long, r - max
  hy=50; ho=62; hr=100; //headline
  ty=100; to=120; tr=140; //tweet
  ey=35; eo=40; er=50; //email

  y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
  yc="#f1c40f"; oc="#e67e22"; rc="#E74C3C"; tc="transparent";

  // restore form data -- if available & recheck triggers!
  getData();

  // debounced keyup handler for color checking & title casing & autosaving to localStorage
  $('.hl').on('keyup', _.debounce(function (e) {
    colorCheck($(this));
    $(this).val($(this).val().toTitleCase());
    saveData();
  }, 100));

  // un-debounced keyup handler for character counting
  $('.hl').on('keyup', function(){
    $(this).next(".count")[0].innerText = $(this).val().length;
  });

  // handler for content type switching. also changes char counts & re-runs colorCheck.
  $(".sel").on('click', function(){
    teaser();
    $(".sel").removeClass("sela");
    $(this).addClass("sela");

    if ( $(this)[0].id == "selh" ){
      y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
      $('#len1').text(hy);
      $('#len2').text(ho);
      $('#len3').text(hr);
      $('#contentType').text("Headlines");
    }

    if ( $(this)[0].id == "selt" ){
      y=ty; o=to; r=tr; $('input').attr('maxlength', r);
      $('#len1').text(ty);
      $('#len2').text(to);
      $('#len3').text(tr);
      $('#contentType').text("Tweets");
    }

    if ( $(this)[0].id == "sele" ){
      y=ey; o=eo; r=er; $('input').attr('maxlength', r);
      $('#len1').text(ey);
      $('#len2').text(eo);
      $('#len3').text(er);
      $('#contentType').text("Subject lines");
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
    console.log("ok, we found some data!");
    $('.hl').each(function(k,v){
      v.value = data["h"+(k+1)];
      $(this).next(".count")[0].innerText = $(this).val().length;
    });
    colorCheckAll();
  } else { console.log("womp womp - no data here.");}
}

// reset form data & localstorage & app state.
function clearData(){
  localStorage.clear();
  colorCheckAll();
  $(".count").each(function(k,v){
    v.innerText="0";
  });
}

// teaser changer
function teaser(){
  t=[
  "You gotta kiss a few frogs, #amirite?",
  "The social juice is worth the squeeze.",
  "There's always another angle.",
  "Copywriters aren't born. They practice.",
  "Want more clicks? Practice your pitch.",
  "They won't all be great, but one will."
  ];
  $("#teaser").text(t[Math.floor((Math.random() * t.length))]);
}
