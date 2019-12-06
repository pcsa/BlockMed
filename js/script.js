var BlockMed;
var userAccount;
var acc;
var exam_id = 0;
var listOfClients = [];
var status = "Start";

function startApp() {
var BlockMedAddress = "0xf1c649e1861dA09bC699Cbdb91478d7730E9D99f";
BlockMed = new web3.eth.Contract(abi, BlockMedAddress);

var accountInterval = setInterval(function () {

    web3.eth.getAccounts().then(function (result) {
        acc = result[0];
    })

    if (acc !== userAccount) {
        userAccount = acc;
        refreshData();
    }
  }, 100);

}

function getMedic() {
  return BlockMed.methods.getMedic().call({from: userAccount});
}

function getLab() {
  return BlockMed.methods.getLab().call({from: userAccount});
}

function getPacients(index) {
  if(index === 0){
    return BlockMed.methods.getPacientsMed().call({from: userAccount}); 
  }
  return BlockMed.methods.getPacientsLab().call({from: userAccount});
  
}

function add_client(client_, name, age, bt, allergies) {
  BlockMed.methods.add_client(client_, name, age, bt, allergies).send({from: userAccount});
}

function add_client2me(client_) {
  BlockMed.methods.add_client2me(client_).send({from: userAccount});
}

function getClient(account) {
  return BlockMed.methods.getClient(account).call({from: userAccount});
}

function getExam(account,id) {
  return BlockMed.methods.getExam(account,id).call({from: userAccount});
}

function addExam(account, exam) {
  BlockMed.methods.getExam(account, exam).send({from: userAccount});
}

function medic(){
  BlockMed.methods.isMedic().call({from: userAccount}).then( (result) => {
    if( result ){
      getMedic().then((result) => {document.getElementById("ClientName").innerHTML = result;});
      getPacients(0).then((result) => { listClients(result); });
      resetForm();
      document.getElementById("addClient").style.visibility = "visible";
    }
  });
}

function lab(){
  BlockMed.methods.isLab().call({from: userAccount}).then( (result) => {
    if( result ){
      getLab().then((result) => {document.getElementById("ClientName").innerHTML = result;});
      getPacients(1).then((result) => { listClients(result); });
      resetForm();
      document.getElementById("addExam_").style.visibility = "visible";
    }
  });
}

function refreshData() {
  BlockMed.methods.isClient(userAccount).call({from: userAccount}).then( (result) => {
    if( result ){
      showClient(-1);
    }
    resetForm();
  });
}

function showExams() {
  refreshData();
  google.charts.load('current', {'packages':['corechart']});
  google.charts.setOnLoadCallback(drawChart);
  document.getElementById('curve_chart').style.position = "relative";
  document.getElementById('curve_chart').style.marginLeft = "2.5%";
  document.getElementById('curve_chart').style.width = "80%";
  document.getElementById('curve_chart').style.height = "500px";
}

function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ['Year', 'Atual', 'Diabetes', 'Normal'],
    ['2012',  90,      400, 100],
    ['2013',  117,      400, 100],
    ['2014',  250,       400, 100],
    ['2015',  320,      400, 100],
    ['2016',  410,       400, 100],
    ['2017',  380,      400, 100],
    ['2018',  350,       400, 100],
    ['2019',  220,      400, 100],
    ['2020',  120,      400, 100]
  ]);

  var options = {
    title: 'Glicose',
    curveType: 'function',
    legend: { position: 'bottom' }
  };

  var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

  chart.draw(data, options);
}

function listClients(strClients,mL) {
  listOfClients = [];
  strClients = strClients + "";
  token = strClients.split(",");
  var tmp = "<ul>";
  for( var i = 0; i < token.length;i++ ){
    listOfClients[i] = token[i];
    //alert(getClientName(i)); //token[i]
    tmp = tmp + "</br>" + "<a href=\"#\" onclick=\"showClient("+i+")\"><li>" +token[i]+"</li></a>";
  }
  tmp = tmp + "</ul>";
  document.getElementById("ClientInfo").innerHTML = tmp;
}

function showClient(index) {
  var address = userAccount;
  if(index > -1){ address = listOfClients[index]; }
  getClient(address).then((result) => {
    token = result.split("::");
    var tmp = "<ul>";
    if(index < 0){ document.getElementById("ClientName").innerHTML = token[0]; }
    else{ tmp = tmp + "<li>Nome: "+token[0]+"</li></br>";}
    tmp = tmp + "<li>Idade: "+token[1]+"</li></br><li>Tipo sanguineo: "+token[2]+"</li></br>";
    exam_id = token[3];
    
    var tmp2 = token[4];
    token2 = tmp2.split(";");
    tmp = tmp + "<li>Alergias: <ul>"
    for( var i = 0; i < token2.length;i++ ){
      tmp = tmp + "</br>" + "<li>"+ token2[i]+"</li>";
    }
    tmp = tmp + "</ul></li>"
    document.getElementById("ClientInfo").innerHTML = tmp;
  });
}

function getClientName(index) {
  var address = userAccount;
  if(index > -1){ address = listOfClients[index]; }
  getClient(address).then((result) => {
    token = result.split("::");
    return token[0];
  });
}

function process(){
  var x = document.getElementById("form");
  var text = [];
  var i;
  for (i = 0; i < x.length ;i++) {
    text[i] = x.elements[i].value;
  }
  if(status == "addClient"){
    BlockMed.methods.isClient(text[0]).call({from: userAccount}).then( (result) => {
    if( result ){
      add_client2me(text[0]);
    }
    else{
      addClientAux();
      return;
    }
    });
  }else if(status == "addClient2"){
    add_client(text[0],text[1],text[2],text[3],text[4]);
  }else if(status == "addExam_"){
    addExam(text[0],text[1]);
  }
  resetForm();
}

function addClientAux(){
  document.getElementById("address_").style.visibility = "hidden";
  document.getElementById("address").style.visibility = "hidden";
  document.getElementById("nome_").style.visibility = "visible";
  document.getElementById("nome").style.visibility = "visible";
  document.getElementById("age_").style.visibility = "visible";
  document.getElementById("age").style.visibility = "visible";
  document.getElementById("blood_").style.visibility = "visible";
  document.getElementById("blood").style.visibility = "visible";
  document.getElementById("allergies_").style.visibility = "visible";
  document.getElementById("allergies").style.visibility = "visible";
  document.getElementById("submit").style.visibility = "visible";
  status = "addClient2";
}

function addClient(){
  document.getElementById("address_").style.visibility = "visible";
  document.getElementById("address").style.visibility = "visible";
  document.getElementById("submit").style.visibility = "visible";
  status = "addClient";
}

function addExam_(){
  document.getElementById("address_").style.visibility = "visible";
  document.getElementById("address").style.visibility = "visible";
  document.getElementById("exam_").style.visibility = "visible";
  document.getElementById("exam").style.visibility = "visible";
  document.getElementById("submit").style.visibility = "visible";
  status = "addExam_";
}

function resetForm(){
  document.getElementById("address").innerHTML = "";
  document.getElementById("nome").innerHTML = "";
  document.getElementById("age").innerHTML = 0;
  document.getElementById("blood").innerHTML = "";
  document.getElementById("allergies").innerHTML = "";
  document.getElementById("exam").innerHTML = "";
  document.getElementById("exam_").style.visibility = "hidden";
  document.getElementById("exam").style.visibility = "hidden";
  document.getElementById("addExam_").style.visibility = "hidden";
  document.getElementById("nome_").style.visibility = "hidden";
  document.getElementById("nome").style.visibility = "hidden";
  document.getElementById("age_").style.visibility = "hidden";
  document.getElementById("age").style.visibility = "hidden";
  document.getElementById("blood_").style.visibility = "hidden";
  document.getElementById("blood").style.visibility = "hidden";
  document.getElementById("allergies_").style.visibility = "hidden";
  document.getElementById("allergies").style.visibility = "hidden";
  document.getElementById("address_").style.visibility = "hidden";
  document.getElementById("address").style.visibility = "hidden";
  document.getElementById("submit").style.visibility = "hidden";
}


// Padrão para detectar um web3 injetado.
window.addEventListener('load', function () {

web3Provider = null;
// Modern dapp browsers...
if (window.ethereum) {
    web3Provider = window.ethereum;
    try {
        // Request account access
        window.ethereum.enable();
    } catch (error) {
        // User denied account access...
        console.error("User denied account access")
    }
}
// Legacy dapp browsers...
else if (window.web3) {
    web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
    console.log('No web3? You should consider trying MetaMask!')
    web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(web3Provider);
startApp()
})