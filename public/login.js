/**
   * Checks if citizen's input username and password are valid
   * Alert if inputs are not valid
   * 
   * Contrains on username and password:
   * - username must have at least 3 characters
   * - username can only contain letters and numbers
   * 
   * - password must have at least 4 characters
   * **/
 function checkUserInput(){
    const nameReg = /^[a-zA-Z0-9][a-zA-Z0-9_-]{2,200}$/;
    if(!nameReg.test($("#username").val())){
        alert("Username invalid!")
        $("#username").focus();
        return false;
    }
    if($("#password").val().length < 4){
        alert("Password should be at least 4 characters!")
        $("#password").focus();
        return false;
    }
    return true;
  }

  function checkUserAgreeCheckBox(){
    
      if ($('#userAgreeCheckBox').prop("checked") == true) {
        console.log("checkBox is checked");
        $('#welcomeModal').modal('hide');
        newUserLoginRequest();
        return true;
      } else {
        var message = "Please check below box to proceed";
        $("#welcome-modal-err-msg").html(message);
        $('#welcomeModal').modal('show');
        return false;
      }
  }
  
 

  function newUserLoginRequest(){
    var requestData = {'username': $("#username").val(),'password': $("#password").val()};
    $.ajax({
      dataType:"json",
      contentType:'application/json;charset=UTF-8',
      data:JSON.stringify(requestData),
      type: 'post',
      url: '/users',
      success: function (_, _, jqXHR) {
      console.log('post requst submitted try to create a new user');
      console.log(jqXHR.responseText);
      
      var response = JSON.parse(jqXHR.responseText);
      storeToken(response["token"]);
      storeStatus(response["status"]);
      storeUsername(response["username"]);
      storeprivilege(response["privilege"]);
      window.location.href="/users/public/"+ $("#username").val();
    },
      error: function (jqXHR, status, err) {
        console.log("post failed", err);
      }
    });
  }


   function showUserCreationModal(){
    var name = $("#username").val();
    var infoStr = "Do you want to create a new User with username: " + name + " ?";
    $(".confirm-modal_body").html(infoStr);
    $('#confirmModal').modal('show');
    

  } 
  
  function hide(){
    $('#confirmModal').modal('hide');
    $('#welcomeModal').modal('hide');
  }

  function showWelcomeModal(){
    $('#confirmModal').modal('hide');
    $('#welcomeModal').modal('show');
  }

  function storeStatus(status){
    localStorage.setItem('status', status);
  }

  function storeToken(tokenString){
    localStorage.setItem('token', tokenString);
  }

  function storeUsername(tokenString){
    localStorage.setItem('username', tokenString);
  }
  function storeprivilege(privilege){
    localStorage.setItem('privilege', privilege);
  }
  

  function existingUserLoginRequest(requestData){
    $.ajax({
        contentType:'application/json;charset=UTF-8',
        data:JSON.stringify(requestData),
        type: 'put',
        url: '/users',
        dataType: "json",
        success: function (data, status, jqXHR) {
            var response = JSON.parse(jqXHR.responseText);
            storeToken(response["token"]);
            storeStatus(response["status"]);
            storeUsername(response["username"]);
            storeprivilege(response["privilege"]);
            window.location.href="/users/public/"+ $("#username").val();
          },
        error: function(jqXHR, status, err){
          var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg
          if (jqXHR.status == 404 && erMsg == "No such user found" ) {
            showUserCreationModal();
          }
          else if (jqXHR.status == 400 && erMsg == 'Username banned') {
            alert("Username Banned");
          }
          else if (jqXHR.status == 400 && erMsg == "Wrong Password") {
            alert("Wrong Password");
          }
          else if (jqXHR.status == 500 && erMsg == 'Server error') {
            alert("Server error");
          } 
          else if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
            alert(erMsg);
          }else if(jqXHR.status == 403 && erMsg == "This user is inactive") {
            alert(erMsg);
          }
        }
      })
    }
    
  

     /**
   * Sends post request if want to create a new user, 
   * Sends put request if want to login as an existing user
   * 
   * - check if userinput is valid: if invalid, do nothing
   * - send a put request to try to login : 
   *    - if success: store token and then goto the chat page
   *    - if failed: 
   *             case 1: no user found - then send a post request
   *             case 2: wrong password - do nothing 
   *             case 3: server error - do nothing
  */
  
  function login(){
    
    if (checkUserInput() == true){
        var requestData = {'username': $("#username").val(),'password': $("#password").val()};
        existingUserLoginRequest(requestData);
    }
    }
