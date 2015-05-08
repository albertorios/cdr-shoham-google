chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.sequence == "return"){
      sendResponse({sequence : localStorage["sequence"] });
    }
    if(request.indx == "return"){
      sendResponse({indx : localStorage["indx"] });
    }
    if(request.up == "return"){
      if(localStorage["hist"] == "No History"){
        localStorage["hist"] = "";
      }
      localStorage["hist"] =localStorage["hist"]+ localStorage["sequence"].charAt(parseInt(localStorage["indx"]));
      var s = parseInt(localStorage["indx"]) +1;
      localStorage["indx"] = String(s);
      sendResponse({up : localStorage["indx"] });
    }
    if(request.random != undefined){
      if(localStorage["hist"] == "No History"){
        localStorage["hist"] = "";
      }
      localStorage["hist"] = localStorage["hist"] + request.random;
      var s = parseInt(localStorage["indx"]) +1;
      localStorage["indx"] = String(s);
      sendResponse({up : localStorage["indx"] });
    }
    if(request.search != undefined){
      if(localStorage['toggle'] == 1){
        localStorage['searches'] += '('+request.search+') ';
      }
      sendResponse({search : localStorage["searches"] });
    }
});

function defaults(){
  //Set Default Sequence
  if(localStorage['Default'] == undefined){
    localStorage['Default'] = 'R';
    localStorage['condition'] = 'Default';
    var conditions = [];
    conditions.push('Default');
    chrome.storage.sync.set({'conditions': conditions},function(){
      console.log('Default Conditions Set');
    });
    localStorage['sequence'] = localStorage[localStorage['condition']];
    localStorage["indx"] = "0";
    localStorage["hist"] = "No History"
    localStorage['searches'] = '';
    localStorage['toggle'] = 0;
  }
}
defaults();
