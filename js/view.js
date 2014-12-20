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

      //console.log(vfinal);
      return vfinal;
};

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

      // reapply title casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toTitleCase();
        }
      });
    }

    if ( type == "Tweets" ){
      y=ty; o=to; r=tr; $('input').attr('maxlength', r);
      $('#len1').text(ty);
      $('#len2').text(to);
      $('#len3').text(tr);

      // reapply sentence casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toSentenceCase();
        }
      });
    }

    if ( type == "Subject lines" ){
      y=ey; o=eo; r=er; $('input').attr('maxlength', r);
      $('#len1').text(ey);
      $('#len2').text(eo);
      $('#len3').text(er);

      // reapply sentence casing
      $('.hl').each(function(k,v){
        if(v.value){
          v.value = v.value.toSentenceCase();
        }
      });
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
