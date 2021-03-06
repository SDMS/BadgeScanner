google.load('visualization', 1.0);

var timeout;

$( document ).ready(function() {
  $("#title").html(eventName);
  $("#sid").keyup(function (e) {
    if (e.keyCode === 13) {
       removeFromPage();
       getStudent();
    }
  });

});

function getStudent(){

  var id = $("#sid").val();
  console.log(id);

  if(typeof id == 'string') {
    if(id.charAt(0) == 'P') id = id.substring(1);
  }

  var opts = {sendMethod: 'auto'};
  var query = new google.visualization.Query(databaseInfo.link, opts);
  query.setQuery('select * where ' + databaseInfo.column + ' =' + id);
  query.send(handleQueryResponse);
  console.log('sent');
  var loading = {
      sid: "1",
      firstName: "Loading...",
      lastName: "",
      grade: "",
      team: ""
  }
  addToPage(loading, 999999999);
  $("#sid").val("");
  $("img").remove();
}

function handleQueryResponse(response){
  console.log("recieving response");
  if(response.isError()){
    console.log('Error: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data = response.getDataTable();
  if(data.getNumberOfRows() > 1) {
    alert("Please ask a teacher for help.");
    removeFromPage();
    $("#sid").val('');
    return;
  }else if(data.getNumberOfRows() < 1){
    alert("Did you type your ID in correctly?");
    removeFromPage();
    $("#sid").val('');
    return;
  }

  var student = {
      sid: data.getValue(0,0),
      firstName: data.getValue(0,1),
      lastName: data.getValue(0,2),
      grade: data.getValue(0,3),
      team: data.getValue(0,4)
  }

  postToGoogle(student);
}

function postToGoogle(student) {
  var form = document.createElement("form");

  form.action = formInfo.link;
  form.method = "POST";
  form.id="ss-form";
  form.target = "my_iframe";
  var timeIn = new Date();

  form.innerHTML = [
    "<input id='entry_1826631571' name = '" + formInfo.timeIn + "'' value = '" + timeIn + "'/>",
    "<input id='entry_846193839' name = '" + formInfo.sid + "' value = '" + student.sid + "'/>",
    "<input id='entry_1810641923' name = '" + formInfo.firstName + "' value = '" + student.firstName + "'/>",
    "<input id='entry_2112623826' name = '" + formInfo.lastName + "' value = '" + student.lastName + "'/>",
    "<input id='entry_421600000' name = '" + formInfo.grade + "' value = '" + student.grade + "'/>",
    "<input id='entry_1105692196' name = '" + formInfo.team + "' value = '" + student.team + "'/>"
  ].join("");

  form.submit();
  addToPage(student, 8000);
}

function addToPage(student, delay){
  $("#student").attr("data-sid", student.sid);
  $("#student #first-name").html(student.firstName);
  $("#student #last-name").html(student.lastName);
  $("#student #grade").html(student.grade);
  $("#student #team").html(student.team);
  clearTimeout(timeout);
  timeout = setTimeout(removeFromPage, delay);
}

function removeFromPage(){
  $("#student").attr("data-sid", 0);
  $("#student #first-name").html("");
  $("#student #last-name").html("");
  $("#student #grade").html("");
  $("#student #team").html("");
  clearTimeout(timeout);
}
