//Global Vars
var seq = "";
var i = 0;
var size = 0;
var toggle = 0;

//Message Sending Functions
function loadSequence(){
  //Request Global Dice Sequence
  chrome.runtime.sendMessage({sequence : "return"}, function(response){
    seq = response.sequence;
    console.log(seq);
  });
}
function loadIndex(){
  //Request Global Dice Sequence Index
  chrome.runtime.sendMessage({indx : "return"}, function(response){
    i = parseInt(response.indx);
    console.log(i);
  });
}
function updateIndex(){
  //Update Global Dice Sequence Index
  chrome.runtime.sendMessage({up : "return"}, function(response){
    i = parseInt(response.up);
    console.log(i);
  });
}

function randomToss(a){
  var x;
  if(a == 'Heads'){
    x = 'H';
  }
  else{
    x='T';
  }
  chrome.runtime.sendMessage({random: String(x)}, function(response){
    i = parseInt(response.up);
    console.log(i);
  });
}
function search(x){
  chrome.runtime.sendMessage({search: String(x)}, function(response){
    console.log(response.search);
  });
}
//CHECK FOR ROLL OR DICE OR DIE in url
function urlSearch(u){
  var a = u.indexOf("flip");
  var b = u.indexOf("Flip");
  var c = u.indexOf("coin");
  var d = u.indexOf("Coin");
  if(a+b+c+d > -3){
    toggle++;
  }
}


//Search for dice roll on page
function tossSearch(){
  setTimeout(function(){
    var s = document.getElementById("lst-ib").value;
    search(s);
    if(toggle == 1){
      var x = document.getElementsByClassName("_SFe _rCe")[0];
      if(i>= seq.length){
        randomToss(x.innerHTML);
      }
      else{
        if(seq.charAt(i) == 'R' || seq.charAt(i) == 'r'){
          randomToss(x.innerHTML);
        }
        else{
          var replace;
          if(seq.charAt(i) == 'H' || seq.charAt(i) == 'h'){
             replace= 'Heads';
          }
          else{
            replace = 'Tails';
          }
          x.innerHTML = replace;
          setTimeout(function(){
            var y = x.parentNode.parentNode.parentNode.previousSibling.firstChild;
            y.src = "https://www.gstatic.com/lrfactory/funbox_simple/coin-flip-"+replace.toLowerCase() +"-5124x183.png"
            updateIndex();
          },50);
        }
      }
      $("a:contains('Flip it')").click(function(){
        location.reload();
      });
    }
  }, 200);
}

urlSearch(window.location.href);
loadSequence();
loadIndex();
tossSearch();
