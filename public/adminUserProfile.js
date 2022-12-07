var url = window.location.href;
var strs = url.split('/');
var curUserName = strs[strs.length - 1];
var prevUsername = null;
var username = localStorage.getItem('username')

var socket =  io({
    query:{
        user: username
    }
})

socket.on('connect',()=>{
    updateUserSocketMap(username, socket)
})

socket.on('logout',()=>{

    var 
    data 
    =
        {'username' : localStorage.getItem('username')}

    $.ajax(
        {
        type: 'put',
        url: "/users/offline",
        data: JSON.stringify(data),
        dataType: "json",
        headers: { "token": localStorage.getItem('token') },
        success: function () {
            socket.emit('showUser');
            alert("you has been set to be inactive")
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function () {
            console.log('logout fail');
        }
    })

})


function checkUserInput(){
    const nameReg = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,200}$/;
    if(!nameReg.test($("#new_username").val())){
        alert("Username invalid!")
        $("#new_username").focus();
        return false;
    }
    if($("#new_pwd").val().length < 4){
        alert("Password should be at least 4 characters!")
        $("#new_pwd").focus();
        return false;
    }
    return true;
}

function getUserProfile(){
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/admin?username=' + localStorage.getItem("userToEdit"),
        dataType: 'json',
        headers: { "token": localStorage.getItem('token') },
        success: function (data) {
          if(data){
            prevUsername = data.ret[0].username;
            
            var prevAccountStatus = data.ret[0].accountStatus;
            var prevPrivilege = data.ret[0].privilege;
            var pwd = data.ret[0].password;

            if(prevPrivilege)
            prevPrivilege =  prevPrivilege.toLowerCase();

            document.getElementById("new_username").value = prevUsername;

            if(prevAccountStatus)
            prevAccountStatus = prevAccountStatus.toLowerCase();

            var pGroup = document.getElementsByName("pStatus");

            if(pwd){
                document.getElementById("new_pwd").value = pwd;
                document.getElementById("confirm_pwd").value = pwd;
            };

            if(prevPrivilege == "citizen"){
                pGroup[2].checked = true;
            }
            else if(prevPrivilege == "administrator"){
                pGroup[0].checked = true;
            }
            else if(prevPrivilege == "coordinator"){
                pGroup[1].checked = true;
            }
            var aGroup = document.getElementsByName("aStatus");
            if(prevAccountStatus == "active"){
                aGroup[0].checked = true;
            }
            else if(prevAccountStatus == "inactive"){
                aGroup[1].checked = true;
            }
          }
        },
        error: function(jqXHR){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;

            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
    });
}

function confirmEditUser(){
   var newUsername = document.getElementById("new_username").value;
   var newPwd = document.getElementById("new_pwd").value;
   var confirmPwd = document.getElementById("confirm_pwd").value;
   console.log("newusername: "+newUsername+" newPwd: "+ newPwd+" confirmpwd: "+ confirmPwd);

   if(newUsername == "ESNAdmin"){
    alert("This name is banned");
    return;
   }
   if(newPwd != confirmPwd){
    alert("Your password do not match");
    return;
   }

   if(!checkUserInput()) return;
   
    var statusGroup=document.getElementsByName('pStatus');
    var curP = null;
    for(i = 0; i < statusGroup.length; i++){
        if(statusGroup[i].checked){
                curP=statusGroup[i].id;
        }
    }

    var curA = null;
    var aStatusGroup=document.getElementsByName('aStatus');
    for(i = 0; i < aStatusGroup.length; i++){
        if(aStatusGroup[i].checked){
                curA=aStatusGroup[i].id;
        }
    }

    var data = {
        "username": newUsername,
        "password": newPwd,
        "accountStatus": curA,
        "privilege": curP,
        "formerUsername": prevUsername
    };

    console.log(data);

    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(data),
        type: 'put',
        url: '/admin',
        dataType: 'json',
        headers: { "token": localStorage.getItem('token') },
        success: function () {
          alert("Success");
          back();
        },
        error: function(jqXHR){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            alert(erMsg);
            window.location.reload()
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
    });
}

function back(){

    window.location.href = "/users/directory/" + localStorage.getItem('username')
}

getUserProfile();
