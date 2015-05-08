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

function randomRoll(a){
  chrome.runtime.sendMessage({random: String(a)}, function(response){
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
  var a = u.indexOf("roll");
  var b = u.indexOf("Roll");
  var c = u.indexOf("dice");
  var d = u.indexOf("Dice");
  var e = u.indexOf("die");
  var f = u.indexOf("Die");
  if(a+b+c+d+e+f > -5){
    toggle++;
  }
}

//Search for dice roll on page
function rollSearch(){
  setTimeout(function(){
    var s = document.getElementById("lst-ib").value;
    search(s);
    if(toggle == 1){
      var x = document.getElementsByClassName("_SFe _rCe")[0];
      if(i>= seq.length){
        randomRoll(x.innerHTML);
      }
      else{
        if(seq.charAt(i) == 'R' || seq.charAt(i) == 'r'){
          randomRoll(x.innerHTML);
        }
        else{
          x.innerHTML = seq.charAt(i);
          setTimeout(function(){
            var y = x.parentNode.parentNode.parentNode.previousSibling.firstChild;
            y.src = "https://www.gstatic.com/lrfactory/funbox_simple/dice-rolling-"+seq.charAt(i)+".png";
            updateIndex();
          },200);
        }
      }
      $("a:contains('Roll it')").click(function(){
        location.reload();
      });
    }
  }, 250);
}

urlSearch(window.location.href);
loadSequence();
loadIndex();
rollSearch();
