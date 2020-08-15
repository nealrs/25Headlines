$( document ).ready(function() {
  console.log("Thanks for using 25 Headlines! ~ Neal Shyam. FYI, I make other cool stuff too @ https://nealshyam.com");

  // check if this is a /v/ in URL (view mode) vs. edit mode
  if ((window.location.href).includes('/v/')){
    // restore form data from AWS -- if available & recheck triggers!
    const id = getId("id");
    getAWS(id);
  } else {
    // set input limit based on doc type
    const lim=$('#len3').text();
    $('input').attr('maxlength', lim);
    // restore form data from localstorage-- if available & recheck triggers!
    restoreCache();
  }
});

/* EVENT LISTENERS & SUPPORT FUNCTIONS */

function getId(variable){
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i=0;i<vars.length;i++) {
    const pair = vars[i].split("=");
    if(pair[0] == variable){return pair[1];}
    }
    // throw an error here / alert user that ID couldn't be found.
    //alert("Uhm yeah, that's an invalid id / URL bro.");
    return(false);
}

// debounced keyup handler for color checking & autosaving to localStorage
$('.hl').on('keyup', _.debounce( async function (e) {
  colorCheck($(this));
  await saveCache();
}, 100));

// un-debounced keyup handler for character counting
$('.hl').on('keyup', function(){
  $(this).next(".count")[0].innerText = $(this).val().length;
});

// handler for reset button
$("#reset").on('click', function(){
  $('form')[0].reset();
  clearCache();
  $(".count").each(function(k,v){
    v.innerText="0";
  });
  colorCheckAll();
});

// handler for download button
$("#download").on('click', function(){
  // http://stackoverflow.com/questions/3665115/create-a-file-in-memory-for-user-to-download-not-through-server

  let pl=new Date().toLocaleString()+" | 25 Headlines | Made by Neal Shyam (nealshyam.com)\n\n";
  $('.hl').each(function(k,v){
    pl += v.value+"\n";
  });

  const dl = document.createElement('a');
  dl.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(pl));
  dl.setAttribute('download', "25Headlines_Export.txt");
  dl.click();
});

// handler for share button
$("#share").on('click', function(){
  //console.log('share click');
  share();
});

// length based color checking
function colorCheck(e){
  const yc="#f1c40f";
  const oc="#e67e22";
  const rc="#E74C3C";
  const tc="transparent";
  const sc="repeating-linear-gradient(45deg, #DDDDDD, #DDDDDD 10px, #f1c40f 10px, #f1c40f 20px";
  const y=$('#len1').text();
  const o=$('#len2').text();
  const r=$('#len3').text();

  
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
  if ( $('#contentType').text() == "Subject lines" && spammy( " "+e.val()+" " ) ){
    e.css("background", sc);
  }
}

function colorCheckAll(){
  $('.hl').each(function(k,v){
    colorCheck($(this));
  });
}

// save form data to localstorage
async function saveCache(){
  const data = await getForm();
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

async function getForm(){
  const data = {};
  const inputs = $('input');
  for (i in inputs){
    data[inputs[i].id] = inputs[i].value;
  }
  return data;
}

// restore form data & app state from localstorage
function restoreCache(){
  let data;
  if( $('#contentType').text() == "Headlines" ){
    data = JSON.parse(localStorage.getItem('dataH'));
  }
  else if ( $('#contentType').text() == "Tweets" ){
    data = JSON.parse(localStorage.getItem('dataT'));
  }
  else if ( $('#contentType').text() == "Subject lines" ){
    data = JSON.parse(localStorage.getItem('dataE'));
  }

  restoreData(data);
  colorCheckAll();
}

// reset form data & localstorage & app state.
function clearCache(){
  //localStorage.clear();
  if( $('#contentType').text() == "Headlines" ){
    localStorage.setItem('dataH', null);
  }
  else if ( $('#contentType').text() == "Tweets" ){
    localStorage.setItem('dataT', null);
  }
  else if ( $('#contentType').text() == "Subject lines" ){
    localStorage.setItem('dataE', null);
  }
}

// SAVE DATA TO EXTERNAL DATASTORE
function getAWS(id){
  // MAKE GET REQUEST TO LAMBDA
  $.ajax({
    url: 'https://c4e1iqlbd6.execute-api.us-east-1.amazonaws.com/default/25headlines-get',
    type: 'POST',
    crossDomain: true,
    contentType: 'application/json',
    data: JSON.stringify({id}),
    dataType: 'json',
    success: (data) => {
      //success stuff. data here is the response, not your original data
      const type = data.data.type;
      const lines = data.data;
      if (type=="Emails"){type="Subject lines";}
      var slug = type.substring(0, type.length - 1);
      $('#contentType').text(slug.toLowerCase());

      // restore data from firebase & run color checks.
      restoreData(lines);
      typeCheck(type);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      alert("Uhm yeah, that's an invalid id / URL bro.");
    }
  });
}

async function saveAWS(id){
  const data = await getForm();
  data.type = $('#contentType').text();
  delete data.undefined; // why is there even an undefined prop in here??!
  //console.log(id, data);
  const payload = {id, data};
  //console.log(JSON.stringify(payload));
  
  await $.ajax({
    url: 'https://c4e1iqlbd6.execute-api.us-east-1.amazonaws.com/default/25headlines-save',
    type: 'POST',
    crossDomain: true,
    contentType: 'application/json',
    data: JSON.stringify(payload),
    //dataType: 'json',
    success: (data) => {
      //console.log(data);
      console.log(`Data saved, now let's go see it!`);
    },
    error: function(xhr, ajaxOptions, thrownError) {
      console.log(ajaxOptions);
      alert("Yikes on bikes, there was an error saving your headlines.");
    }
  });
}

// viewer related length checks/setting
function typeCheck(type){
  // length triggers y - long, o - too long, r - max
  const hy=50; const ho=62; const hr=100; //headline
  const ty=100; const to=120; const tr=140; //tweet
  const ey=35; const eo=40; const er=50; //email

  let y=hy; let o=ho; let r=hr; 
  $('input').attr('maxlength', r);

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

// repopulate data from localStorage or external datastore
function restoreData(data){
  //console.log(data);
  if (data){
    //console.log("ok, we found some data!");
    $('.hl').each(function(k,v){
      v.value = (data["h"+(k+1)]) ? data["h"+(k+1)] : '' ;
      $(this).next(".count")[0].innerText = $(this).val().length;
      //console.log(v.value);
    });
  } //else {console.log("womp womp - no data here.");}
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

// Export & Save data to AWS
async function share() {
  const id = uuidv4();
  await saveAWS(id);
  window.open("v/?id="+id); // works on github.*/
}

function spammy(s){
/*******

spammy by Neal Shyam [@nealrs] [MIT licensed]

usage:
  spammy("Hey, do you want to buy a luxury car $$$?"); // true
  spammy("Great apartments - no fees"); // true
  spammy("Check it out bruh"); // true because of 'check'
  spammy("Can you take a look at this?"); // false
  spammy("Win a million dollars"); // true
  spammy("I love you"); // false

********/
  const x = s.match(/As seen on|spam|Buy|Buy direct|Buying judgments|Clearance|Order|Order status|Orders shipped by|shopper|Dig up dirt on friends|Meet singles|Score with babes|Additional Income|Be your own boss|Compete for your business|Double your|Earn \$|Earn extra cash|Earn per week|Expect to earn|Extra income|Home based|Home employment|Homebased business|Income from home|Make \$|Make money|Money making|Online biz opportunity|Online degree|Opportunity|Potential earnings|University diplomas|While you sleep|Work at home|Work from home|\$\$\$|Affordable|Bargain|Beneficiary|Best price|Big bucks|Cash|Cash bonus|Cashcashcash|Cents on the dollar|Cheap|Check|Claims|Collect|Compare rates|Cost|Credit|Credit bureaus|Discount|Earn|Easy terms|F r e e|Fast cash|For just \$XXX|Hidden assets|hidden charges|Income|Incredible deal|Insurance|Investment|Loans|Lowest price|Million dollars|Money|Money back|Mortgage|Mortgage rates|No cost|No fees|One hundred percent free|Only \$|Pennies a day|Price|Profits|Pure profit|Quote|Refinance|Save \$|Save big money|Save up to|Serious cash|Subject to credit|They keep your money -- no refund!|Unsecured credit|Unsecured debt|US dollars|Why pay more\?|Accept Credit Cards|Cards accepted|Check or money order|Credit card offers|Explode your business|Full refund|Investment decision|No credit check|No hidden Costs|No investment|Requires initial investment|Sent in compliance|Stock alert|Stock disclaimer statement|Stock pick|Avoid bankruptcy|Calling creditors|Collect child support|Consolidate debt and credit|Consolidate your debt|Eliminate bad credit|Eliminate debt|Financially independent|Get out of debt|Get paid|Lower interest rate|Lower monthly payment|Lower your mortgage rate|Lowest insurance rates|Pre-approved|Refinance home|Social security number|Your income|Acceptance|Accordingly|Avoid|Chance|Dormant|Freedom| here |Hidden|Home|Leave|Lifetime|Lose|Maintained|Medium|Miracle|Never|Passwords|Problem|Remove|Reverses|Sample|Satisfaction|Solution| stop |Success|Teen|Wife| Dear |Friend|Hello| ad | ads |Auto email removal|Bulk email|Click|Click below|Click here|Click to remove|Direct email|Direct marketing|Email harvest|Email marketing|Form|Increase sales|Increase traffic|Increase your sales|Internet market|Internet marketing|Marketing|Marketing solutions|Mass email|Member|Month trial offer|More Internet Traffic|Multi level marketing|Notspam|One time mailing|Online marketing|Open|Opt in|Performance|Removal instructions|Sale|Sales|Search engine listings|Search engines|Subscribe|The following form|This isn't junk|This isn't spam|Undisclosed recipient|Unsubscribe|Visit our website|We hate spam|Web traffic|Will not believe your eyes|Cures baldness|Diagnostics|Fast Viagra delivery|Human growth hormone|Life Insurance|Lose weight|Lose weight spam|Medicine|No medical exams|Online pharmacy|Removes wrinkles|Reverses aging|Stop snoring|Valium|Viagra|Vicodin|Weight loss|Xanax|#1|100% free|100% Satisfied|4U|50% off|Billion|Billion dollars|Join millions|Join millions of Americans|Million|One hundred percent guaranteed|Thousands|Being a member|Billing address|Call|Cannot be combined with any other offer|Confidentially on all orders|Deal|Financial freedom|Gift certificate|Giving away|Guarantee|Have you been turned down\?|If only it were that easy|Important information regarding|In accordance with laws|Long distance phone offer|Mail in order form|Message contains|Name brand|Nigerian|No age restrictions|No catch|No claim forms|No disappointment|No experience|No gimmick|No inventory|No middleman|No obligation|No purchase necessary|No questions asked|No selling|No strings attached|No-obligation|Not intended|Obligation|Off shore|Offer|Per day|Per week|Priority mail|Prize|Prizes|Produced and sent out|Reserves the right|Shopping spree|Stuff on sale|Terms and conditions|The best rates|They're just giving it away|Trial|unlimited|Unsolicited|Vacation|Vacation offers|Warranty|We honor all|Weekend getaway|What are you waiting for\?|Who really wins\?|Win|Winner|Winning|won|You are a winner!|You have been selected|You're a Winner!|Cancel at any time|Compare|Copy accurately|Get|Give it away|Print form signature|Print out and fax|See for yourself|Sign up free today|Free|Free access|Free cell phone|Free consultation|Free DVD|Free gift|Free grant money|Free hosting|Free installation|Free Instant|Free investment|Free leads|Free membership|Free money|Free offer|Free preview|Free priority mail|Free quote|Free sample|Free trial|Free website|All natural|All new|Amazing|Certified|Congratulations|Drastically reduced|Fantastic deal|For free|Guaranteed|It's effective|Outstanding values|Promise you|Real thing|Risk free|Satisfaction guaranteed|Access|Act Now!|Apply now|Apply Online|Call free|Call now|Can't live without|Do it today|Don't delete|Don't hesitate|For instant access|For Only|For you|Get it now|Get started now|Great offer|Info you requested|Information you requested|Instant|limited time|New customers only|Now|Now only|Offer expires|Once in lifetime|One time|Only|Order now|Order today|Please read|Special promotion|Supplies are limited|Take action now|Time limited|Urgent|While supplies last|Addresses on CD|Beverage|Bonus|Brand new pager|Cable converter|Casino|Celebrity|Copy DVDs|Laser printer|Legal|Luxury car|New domain extensions|Phone|Rolex|Stainless steel/gi);
  //console.log(x);
  if (x){return true;} else {return false;}
}
