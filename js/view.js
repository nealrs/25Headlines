/*
* To Title Case 2.1 – http://individed.com/code/to-title-case/
* Copyright © 2008–2013 David Gouch. Licensed under the MIT License.
*/

/*CSS Tricks: http://css-tricks.com/snippets/javascript/get-url-variables/*/
function getId(variable){
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
    }
    // throw an error here / alert user that ID couldn't be found.
    //alert("Uhm yeah, that's an invalid id / URL bro.");
    return(false);
}

/*------------And now, the stuff I actually wrote myself.-----------*/

$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam");

  var id = getId("id");
  //console.log(id);

  var fb = new Firebase('https://25h.firebaseio.com/data/'+id);
  fb.on("value", function(snapshot) {
    //console.log(snapshot.val());
    var data = snapshot.val();
    var timestamp = data.timestamp; delete data.timestamp;
    var type = data.type; delete data.type;

    //console.log(timestamp, type);
    //console.log(data);

    // fill in content type in header.
    if (type=="Emails"){type="Subject lines";}
    var slug = type.substring(0, type.length - 1);
    $('#contentType').text(slug.toLowerCase());

    // restore data from firebase & run color checks.
    restoreData(data);
    runCheck(type);

  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
    alert("Uhm yeah, that's an invalid id / URL bro.");
  });

  function runCheck(type){
    // length triggers y - long, o - too long, r - max
    hy=50; ho=62; hr=100; //headline
    ty=100; to=120; tr=140; //tweet
    ey=35; eo=40; er=50; //email

    y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
    yc="#f1c40f"; oc="#e67e22"; rc="#E74C3C"; tc="transparent";

    // count characters & run colorCheck.
    if ( type == "Headlines" ){
      y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
      $('#len1').text(hy);
      $('#len2').text(ho);
      $('#len3').text(hr);
    }

    if ( type == "Tweets" ){
      y=ty; o=to; r=tr; $('input').attr('maxlength', r);
      $('#len1').text(ty);
      $('#len2').text(to);
      $('#len3').text(tr);
    }

    if ( type == "Subject lines" ){
      y=ey; o=eo; r=er; $('input').attr('maxlength', r);
      $('#len1').text(ey);
      $('#len2').text(eo);
      $('#len3').text(er);

    }
    // recheck all inputs against length triggers
    colorCheckAll();
  }

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

// restore form data & app state from localstorage
function restoreData(data){
  //console.log(data);
  if (data){
    //console.log("ok, we found some data!");
    $('.hl').each(function(k,v){
      v.value = data["h"+(k+1)];
      $(this).next(".count")[0].innerText = $(this).val().length;
      //console.log(v.value);
    });
  } //else {console.log("womp womp - no data here.");}
}
