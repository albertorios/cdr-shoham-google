var db;
function loadConditions(){
  var cout = "Conditions:";
  chrome.storage.sync.get({'conditions' : []}, function(result){
    var conds = result['conditions'];
    console.log("Loading conditions");
    console.log(conds);
    for(var c in conds){
      cout = cout + "<br> &emsp;" + conds[c] + ": "+ localStorage[conds[c]];
      document.getElementById("conditions").innerHTML = cout;
    }
  });
}

function addCondition(){
  var x = document.getElementById("newCondition").value;
  var y = document.getElementById("newSequence").value;
  var z = 0;
  var re = /^[HhTtRr]*$/;
  chrome.storage.sync.get({'conditions' : []}, function(result){
    var conds = result.conditions;
    for(var c in conds){
      if(conds[c] == x){
        z =1;
      }
    }
  });
  setTimeout(function(){
    if(x == '' || x == null){
      alert('Please Enter a Name.');
    }
    else if(y == '' || y == null){
      alert('Please Enter a Sequence.');
    }
    else if( z == 1){
      alert('Condition Name Already in Use. Use a Different Name')
    }
    else if(y.match(re) == null){
      alert('Please Enter a Valid Sequence');
    }
    else{
      localStorage[x] = y;
      console.log('New Condition and Sequence Set');
      chrome.storage.sync.get({'conditions' : []}, function(result){
        var conds = result['conditions'];
        conds.push(x);
        console.log("Getting all conditions");
        console.log(conds);
        chrome.storage.sync.set({'conditions': conds},function(){
          console.log('Setting all conditions');
          document.getElementById("newCondition").value = "";
          document.getElementById("newSequence").value="";
          loadConditions();
        });
      });
    }
  },50);
}

function deleteCondition(){
  var x = document.getElementById('deleteCondition').value;
  localStorage[x] =undefined;
  chrome.storage.sync.get({'conditions' : []}, function(result){
    var conds = result.conditions;
    var nConds = [];
    for(var c in conds){
      console.log(x);
      console.log(conds[c]);
      if(conds[c] != x){
        nConds.push(conds[c]);
      }
    }
    chrome.storage.sync.set({'conditions': nConds},function(){
      localStorage['Default'] = 'R';
      localStorage['condition'] = 'Default';
      localStorage['sequence'] = localStorage[localStorage['condition']];
      localStorage["indx"] = "0";
      localStorage["hist"] = "No History"
      console.log('Settings saved');
      document.getElementById('deleteCondition').value ="";
      loadConditions();
    });
  });
}

function JSONToCSVConvertor(JSONData, ReportTitle) {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    var keyNum = 0;
    var tRow ='';

    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        var k = 0;

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
            k++;
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';

        //Find Longest Title
        if( k> keyNum){
          keyNum = k;
          tRow ='';
          for(var index in arrData[i]){
            tRow += index+',';
          }
          tRow = tRow.slice(0,-1) +'\r\n';
        }
    }
    CSV = tRow + CSV;
    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g,"_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function getResponses(){
  var s = [];
   db.transaction(["responses"], "readonly").objectStore("responses").openCursor().onsuccess = function(e) {
       var cursor = e.target.result;
       if(cursor) {
         s.push(cursor.value);
         console.log(s);
         cursor.continue();
       }
       if(cursor == null){
         JSONToCSVConvertor(s, 'responses');
       }
   }
}

window.onload = function(){
  loadConditions();
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
    var z = document.getElementById("getData").addEventListener("click", getResponses);
  }
  openRequest.onerror = function(e) {
    console.log("error opening database")
  }
  var x = document.getElementById("butt1").addEventListener("click", addCondition);
  var y = document.getElementById("butt2").addEventListener("click", deleteCondition);
}
