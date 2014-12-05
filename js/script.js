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

  $('.headline').on('keyup', _.debounce(function (e) {
    if ( $(this).val().length >= 60 && $(this).val().length < 80){
      $(this).css("background-color", "#FFDC00");
    }
    if ( $(this).val().length >= 80){
      $(this).css("background-color", "#FF851B");
    }
    if ( $(this).val().length < 60){
      $(this).css("background-color", "transparent");
    }
    $(this).val($(this).val().toTitleCase());
  }, 100));

  $('.headline').on('keyup', function(){
    $(this).next(".count")[0].innerText = $(this).val().length;
  });

});
