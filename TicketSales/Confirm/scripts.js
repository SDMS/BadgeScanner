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
}

function handleQueryResponse(response){
  if(response.isError()){
    console.log('Error: ' + response.getMessage() + ' ' + response.getDetailedMessage());
    return;
  }
  var data = response.getDataTable();
  if(data.getNumberOfRows() < 1){
    var student = {
      sid: -1,
      firstName: "ERROR:",
      lastName: "",
      grade: "Student not on ticket list",
      team: ""
    }
    addToPage(student);
    $("#sid").val('');
    return;
  }

  var student = {
      sid: data.getValue(0,2),
      firstName: data.getValue(0,3),
      lastName: data.getValue(0,4),
      grade: data.getValue(0,5),
      team: data.getValue(0,6)
  }

  $("#sid").val("");

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
  addToPage(student);
}

function addToPage(student){
  $("#student").attr("data-sid", student.sid);
  $("#student #first-name").html(student.firstName);
  $("#student #last-name").html(student.lastName);
  $("#student #grade").html(student.grade);
  $("#student #team").html(student.team);
  clearTimeout(timeout);
  timeout = setTimeout(removeFromPage, 8000);
}

function removeFromPage(){
  $("#student").attr("data-sid", 0);
  $("#student #first-name").html("");
  $("#student #last-name").html("");
  $("#student #grade").html("");
  $("#student #team").html("");
}