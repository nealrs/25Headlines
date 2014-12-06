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

/*----------------------------------------------------------------*/

$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam");

  // length triggers y - long, o - too long, r - max
  hy=50; ho=62; hr=100; //headline
  ty=100; to=120; tr=140; //tweet
  ey=35; eo=40; er=50; //email

  y=hy; o=ho; r=hr; $('input').attr('maxlength', r);
  yc="#f1c40f"; oc="#e67e22"; rc="#E74C3C"; tc="transparent";

  $('.hl').on('keyup', _.debounce(function (e) {
    colorCheck($(this));
    $(this).val($(this).val().toTitleCase());
  }, 100));

  $('.hl').on('keyup', function(){
    $(this).next(".count")[0].innerText = $(this).val().length;
  });

  $(".sel").on('click', function(){
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

    // recolor check all inputs against length triggers
    $('.hl').each(function(k,v){
      //console.log($(this));
      colorCheck($(this));
    });
  });

});


function colorCheck(e){
  //console.log(e);

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
