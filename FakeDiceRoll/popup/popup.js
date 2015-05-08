var db;
function setCondition(){
  var x = document.getElementById("condition").value;
  if(x == null || x =='' || localStorage[x] == undefined){
    alert('Please Enter a Valid Condition');
  }
  else{
    localStorage['condition'] = x;
    localStorage['sequence'] = localStorage[localStorage['condition']];
    localStorage["indx"] = "0";
    localStorage["hist"] = "No History"
    document.getElementById("condition").value = "";
    loadCondition();
  }
  return 1;
}

function loadCondition(){
  document.getElementById("curcond").innerHTML = "&emsp;"+ localStorage['condition'];
  document.getElementById("curseq").innerHTML = "&emsp;"+ localStorage['sequence'];
}

function newResponse(){
  var x = document.getElementById("parID").value;
  if(x == null || x ==''){
    alert('Please Enter a Participant ID');
  }
  else{
    localStorage['toggle'] = 1;
    $("#condition").prop('disabled',true);
    $("#subbutton").prop('disabled',true);
    $("#startbutton").prop('disabled',true);
    $("#stopbutton").prop('disabled',false);

    localStorage["indx"] = "0";
    localStorage["hist"] = "No History"
    localStorage['searches'] = '';
    d = new Date();
    //Field 0: ID Number
    localStorage['f0'] = x;
    //Field 1: Date
    localStorage['f1'] = d.toDateString();
    //Field 2: Time
    localStorage['f2'] = String(d.getHours()) +':'+ String(d.getMinutes());
    //Field 3: Condition
    localStorage['f3'] = localStorage['condition'];
    //Field 4: Sequence
    localStorage['f4'] = localStorage['sequence'];
    console.log(localStorage['f1'] + localStorage['f2'] + localStorage['f3'] + localStorage['f4']);
    document.getElementById("parID").value = '';
  }
}

function submitResponse(){
  localStorage['toggle'] = 0;
  $("#condition").prop('disabled',false);
  $("#subbutton").prop('disabled',false);
  $("#startbutton").prop('disabled',false);
  $("#stopbutton").prop('disabled',true);
  console.log("About to add: " +localStorage['f1'] + localStorage['f2'] + localStorage['f3'] + localStorage['f4']+ localStorage['hist']);
  var transaction = db.transaction(["responses"],"readwrite");
  var store = transaction.objectStore("responses");
  var response = {
    id:localStorage['f0'],
    date:localStorage['f1'],
    time:localStorage['f2'],
    condition:localStorage['f3'],
    sequence:localStorage['f4'],
    searches:localStorage['searches'],
  }
  for(i=0;i<localStorage["hist"].length;i++){
    response['x'+String(i+1)] = localStorage["hist"].charAt(i);
  }
  var request = store.add(response);
  request.onerror = function(e) {
      console.log("Error",e.target.error.name);
  }
  request.onsuccess = function(e) {
    console.log("Woot! Did it");
  }
}

window.onload = function(){
  var openRequest = indexedDB.open("responseDB",1);
  openRequest.onupgradeneeded = function(e) {
    var thisDB = e.target.result;
    if(!thisDB.objectStoreNames.contains("responses")) {
        thisDB.createObjectStore("responses",{ autoIncrement: true });
    }
  }
  openRequest.onsuccess = function(e) {
    console.log("running onsuccess");
    db = e.target.result;
  }
  openRequest.onerror = function(e) {
    console.log("error opening database")
  }
  var x = document.getElementById("subbutton").addEventListener("click", setCondition);
  var x = document.getElementById("subbutton").addEventListener("click", setCondition);
  var z = document.getElementById("stopbutton").addEventListener("click", submitResponse);
  var y = document.getElementById("startbutton").addEventListener("click", newResponse);
  if(localStorage['toggle'] == 1){
    $("#startbutton").prop('disabled',true);
    $("#condition").prop('disabled',true);
    $("#subbutton").prop('disabled',true);
    $("#stopbutton").prop('disabled',false);
  }
  else{
    $("#subbutton").prop('disabled',false);
    $("#startbutton").prop('disabled',false);
    $("#condition").prop('disabled',false);
    $("#stopbutton").prop('disabled',true);
  }
  loadCondition();
}
