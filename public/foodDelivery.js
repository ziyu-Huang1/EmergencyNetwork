var DisplayStrategy = function(){
    this.role = null;
}

DisplayStrategy.prototype = {
    setStrategy: function (role){
        this.role = role;
    },
    
    work: function(){
        return this.role.display();
    }
};

var Citizen = function(){
    this.display = function(){
        document.getElementById('volunteerContainter').style.display = 'none';
        document.getElementById('citizenContainter').style.display = 'block';
        document.getElementById('myOrdersButton').style.display = 'none';
        document.getElementById('roleText').innerHTML = "<b>Citizen</b>";
        document.getElementById('volunteerOrderContainter').style.display="none";
        document.getElementById('historyOrderContainer').style.display="none";
        getMyRequests();
    }
};

var Volunteer = function(){
    this.display = function(){
        document.getElementById('volunteerContainter').style.display = 'block';
        document.getElementById('citizenContainter').style.display = 'none';
        document.getElementById('myOrdersButton').style.display = 'block';
        document.getElementById('roleText').innerHTML = "<b>Volunteer</b>";
        document.getElementById('volunteerOrderContainter').style.display="none";
        document.getElementById('historyOrderContainer').style.display="none";
        loadMap();
    }
};

var roles = {};
var citizen = new Citizen();
var volunteer = new Volunteer();
var displayStrategy = new DisplayStrategy();



var cx = 0;
var cy = 0;
var index = 0;
var citizenBeingHelped = null;
var curRole = 1;


var url = window.location.href;
var strs = url.split('/');
var curUserName = strs[strs.length - 1];

var socket =  io({
    query:{
        user: curUserName
    }
})

showUserAddress();

socket.on('privilegeChange',(data)=>{
    var privilege  =JSON.parse(JSON.stringify(data))
    localStorage.setItem('privilege',privilege)
    if(privilege == "administrator"){

        socket.emit('showActiveUser')
    }else{

        socket.emit('showUser')
    }
})

socket.on('logout',()=>{

    var data = {'username' : localStorage.getItem('username')}
    
    $.ajax({
        type: 'put',
        url: "/users/offline",
        data: JSON.stringify(data),
        dataType: "json",
        headers: { "token": localStorage.getItem('token') },
        success: function (_, _, jqXHR) {
            socket.emit('showUser');
            console.log('logout success');
            alert("you has been set to be inactive")
            localStorage.setItem('token', jqXHR.responseText);
            window.location.href = "/";
        },
        error: function () {
            console.log('logout fail');
        }
    })

})

socket.on('requestAccepted', msg => {
    alert("Volunteer has accepted your request!");
    getMyRequests();
});

socket.on('requestFinished', msg => {
    alert("Your request is finished!");
    getMyRequests();
});

socket.on('connect', () => {
    updateUserSocketMap(curUserName, socket);}
    );
    
function updateUserSocketMap(username, socket){

  var data = {
      'username': username,
      'socket':socket.id
  }

  $.ajax({
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(data),
      type: 'put',
      url: '/deliverys/socketUpdate',
      dataType: 'json',
      success: function () {
          console.log(username+" directory socket update success", socket.id);
      },
      error: function(){
          console.log(username+" directory socket update failed")
      }
  })

}

console.log(curUserName);

function showUserAddress(){
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/deliverys/userAddress?username=' + curUserName,
        dataType: 'json',
        success: function (data) {
            console.log(data.data.length);
            if(data.data.length > 0){
                document.getElementById("addressText").value =  data.data[0].address ;
            }
            else{
                document.getElementById("addressText").value ="no data";
            }
        },
        error: function(jqXHR){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
      });
}


function newDeliveryRequest(){
    window.location.href = "/users/newDeliverys/" + curUserName;
}

function newAddressEdition(){
    console.log("edit Address");
    window.location.href = "/users/newAddress/" + curUserName;
}

function accept1(){

    console.log(citizenBeingHelped, curUserName);
    
    if(curUserName == citizenBeingHelped){
        alert("Sorry, you cannot help with your request");
        return;
    }

    var data = {
        "id": index,
        "username": curUserName
    };

$.ajax({
    contentType: 'application/json; charset=UTF-8',
    type: 'post',
    url: '/deliverys/requestVolunteer',
    data: JSON.stringify(data),
    dataType: 'json',
    success: function (_, _, jqXHR) {
        if(jqXHR.status == 304){
            alert("Sorry this request has been deleted");
        }
        else{
            alert("success! You are the Volunteer for this order now, thanks!");
        }
        loadMap();
    },

    error: function(){
        alert("Sorry, something went wrong")
    }
    
  });
}

function showVolunteerOrders(){
  document.getElementById('volunteerContainter').style.display = 'none';
  document.getElementById('citizenContainter').style.display = 'none';
  document.getElementById('volunteerOrderContainter').style.display = 'block';
  document.getElementById('historyOrderContainer').style.display = 'block';
  getVolunteerOrders();
};

function volunteerOrderBack(){
  document.getElementById('volunteerContainter').style.display = 'block';
  document.getElementById('citizenContainter').style.display = 'none';
  document.getElementById('volunteerOrderContainter').style.display = 'none';
  document.getElementById('historyOrderContainer').style.display = 'none';
  location.reload();
}

function getMyRequests(){
    $.ajax({
    contentType: 'application/json; charset=UTF-8',
    type: 'get',
    url: '/deliverys/userRequests?username=' + curUserName,
    dataType: 'json',
    success: function (data) {
     // console.log(data);
     document.getElementById("historyRequestContainer").innerHTML = "";
      for(i in data.data){
        item = data['data'][i];
        showMyRequests(item);
      }
    },
    error: function(jqXHR){
        var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
        console.log(erMsg);
        if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
            alert(erMsg);
        }
    }

    });

  }

  displayPageFromStorage();

function displayPage(){
    curRole == 0 ? displayStrategy.setStrategy(volunteer): displayStrategy.setStrategy(citizen);
      displayStrategy.work();
}

function displayPageFromStorage(){
    var hasRedirect = localStorage.getItem('role');

    if(hasRedirect){
        console.log("HAS ROLE INFO");
        curRole = hasRedirect;
        localStorage.removeItem('role');
    }

    displayPage();
}

function switchRole(){
    curRole = 1 - curRole;
    displayPage();
    localStorage.setItem('role', curRole);
    console.log("set storage to", curRole);
}


function loadMap(){

$.ajax({
    contentType: 'application/json; charset=UTF-8',
    type: 'get',
    url: '/deliverys/userAddress?username='+curUserName,
    dataType: 'json',
    success: function (data, _, _) {
        var myInfo = new Array(0);
        var myCenter = [-77.04, 38.907];
        if(data.data.length>0){
            myInfo.push({           
                'type': 'Feature',
                'properties': {
                  'description': '',
                  'id': '' 
                },
                'geometry': {
                'type': 'Point',
                'coordinates': [data.data[0].x, data.data[0].y]
                }
              });
            myCenter = [data.data[0].x, data.data[0].y];
        }
       
        
        mapboxgl.accessToken = 'pk.eyJ1IjoiamFkZTEyMzQiLCJhIjoiY2xhZjBzdW1hMGhtdDNubDJ3dXF6YzJpeCJ9.nPj7-C3FdBFweVYdMXuRfQ';
        const map = new mapboxgl.Map({
            container: 'map',
            // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
            style: 'mapbox://styles/mapbox/streets-v12',
            center: myCenter,
            zoom: 11.15,
            doubleClickZoom: false
        });
        

        $.ajax({
            contentType: 'application/json; charset=UTF-8',
            type: 'get',
            url: '/deliverys/pendingRequests',
            dataType: 'json',
            success: function (data) {
             document.getElementById("pendingRequestContainer").innerHTML = "";
             const mapInfo = new Array(0);
              for(i in data.data){
                item = data['data'][i];
                var x = -77;
                var y = 38;
                if(item.x){
                  x = item.x;
                }
                if(item.y){
                  y = item.y;
                }
                mapInfo.push({           
                  'type': 'Feature',
                  'properties': {
                    'sender': item.sender,
                    'description':
                    '<strong>' + item.sender + '</strong>' + '<p>' + item.description +'</p>',
                    'contact': '<p> contact: ' + item.contact + '</p>',
                    'address': '<p> address: ' + item.address + '</p>',
                    'id': item._id  
                  },
                  'geometry': {
                  'type': 'Point',
                  'coordinates': [x, y]
                  }
                });
              }
        
        
        map.on('load', () => {
            
        
        map.addSource('places', {
        'type': 'geojson',
        'data': {
        'type': 'FeatureCollection',
        'features': mapInfo
        }
        });
        
        // Add a layer showing the places.
        map.addLayer({
        'id': 'places',
        'type': 'circle',
        'source': 'places',
        'paint': {
        'circle-color': '#4264fb',
        'circle-radius': 6,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
        }
        });
        
        // Add a layer showing the places.
        if(myInfo.length > 0){
            console.log("has my info");
            console.log(myInfo);
    
                map.addSource('me', {
                    'type': 'geojson',
                    'data': {
                    'type': 'FeatureCollection',
                    'features': myInfo
                    }
                });
            
                // Add a layer showing the places.
            map.addLayer({
                'id': 'me',
                'type': 'circle',
                'source': 'me',
                'paint': {
                'circle-color': '#ff0000',
                'circle-radius': 6,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff'
                }
            });
    
            }
        
        // Create a popup, but don't add it to the map yet.
        const popup = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false
        });
        
        map.on('click', (e)=>{
            console.log("?");
        })

        map.on('mouseenter', 'places', (e) => {
        console.log("has a mouse");
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = 'pointer';
        
        // Copy coordinates array.
        const coordinates = e.features[0].geometry.coordinates.slice();
        const description = e.features[0].properties.description;
        const address = e.features[0].properties.address;
        const contact = e.features[0].properties.contact;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        
        // Populate the popup and set its coordinates
        // based on the feature found.
        // document.getElementById("info").setHTML(description);
        var newB = document.createElement("button");
        
        newB.type = 'button';
        newB.innerHTML = '<button type="button" onclick="accept1()" id="popup" class="btn btn-dark" > <b>Help</b></button>';
        // newB.value = "Accept";
        // newB.className = "btn btn-dark";
        // newB.onclick = accept1();
        
        var txt = document.createElement('div');
        txt.innerHTML = description;
        
        var addr = document.createElement('div');
        addr.innerHTML = address;

        var cont = document.createElement('div');
        cont.innerHTML = contact;

        var newInfo = document.createElement("div");

        newInfo.appendChild(txt);
        newInfo.appendChild(addr);
        newInfo.appendChild(cont);
        newInfo.appendChild(newB);

        cx = coordinates[0];
        index = e.features[0].properties.id;
        citizenBeingHelped = e.features[0].properties.sender;
        popup.setLngLat(coordinates).setDOMContent(newInfo).addTo(map);
        
        });
        
        });
        
        
            },
            error: function(jqXHR){
                citizenBeingHelped = null;
                var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
                console.log(erMsg);
                if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                    alert(erMsg);
                }
            }
          });


    }
})

}

loadMap();

      function changeMapView(){
        document.getElementById("pendingRequestContainer").style.display = "none";
        document.getElementById("map").style.display = "block";
        loadMap();
      }

      function changeListView(){
        document.getElementById("map").style.display = "none";
        document.getElementById("pendingRequestContainer").style.display = "block";
        getPendingRequests();
      }

      function showMyRequests(data){
        
        var card = document.createElement('div');
        card.style = "max-width: 100%;"
        card.className = "card text-white bg-secondary mb-3"

        const cardtime = document.createElement("span")
        cardtime.style = "float: right";
        cardtime.innerHTML = data.time;

        const description = document.createElement("p");
        description.innerHTML = data.description;
    
        const header = document.createElement("div");
        header.className = "card-header";

        const sender = document.createElement("p");
        sender.innerHTML = '<b>' + data.sender + '</b>';
        sender.style =  "float: left;padding-right: 5px;";

        const body = document.createElement("div");
        body.className = "card-body";
    
        const text = document.createElement("p");
        text.className = "card-text";
        text.innerHTML = data.description;
    
        const status = document.createElement("p");
        status.className = "card-text";
        status.innerHTML = "STATUS : " + data.status;


    const img = document.createElement("img");
    img.src = "/pic/delete.png";
    img.style = "float: right";
    img.width = "30";
    img.height = "30";
    
    img.onclick = function ()
    {
      if(data.status == "pending"){
        popDeleteBox(data._id);
      }
      else{
        alert("Sorry, this request cannot be cancelled.");
      }
    }

    header.appendChild(sender);
    header.appendChild(cardtime);

    status.appendChild(img);
    body.appendChild(text);
    body.appendChild(status);

    if(data.status == "pending"){
        body.style = "background-color:	#BDB76B;";
    }
    else if(data.status == "Finished"){
        body.style = "background-color: #8FBC8F;";
    }
    else if(data.status == "in process"){
        body.style = "background-color: #B0C4DE;";
    }

    if(data.status!="pending"){
      const volunteer = document.createElement("p");
      volunteer.className = "card-text";
      volunteer.innerHTML = "Volunteer: " + data.volunteer;
      body.appendChild(volunteer);
    }
    
        card.appendChild(header);
        card.appendChild(body);
        document.getElementById("historyRequestContainer").append(card);
      }


      function getVolunteerOrders(){
        $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/deliverys/volunteerRequests?username=' + curUserName,
        dataType: 'json',
        success: function (data, _, _) {
         // console.log(data);
         document.getElementById("historyOrderContainer").innerHTML = "";
          for(i in data.data){
            item = data['data'][i];
            showMyOrders(item);
          }
        },
        error: function(jqXHR, _, _){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
      });

      }

      function showMyOrders(data){
   
        var card = document.createElement('div');
        card.style = "max-width: 100%;"
        card.className = "card text-white bg-secondary mb-3"
        const cardtime = document.createElement("span")
        cardtime.style = "float: right";
        cardtime.innerHTML = data.time;

    const description = document.createElement("p");
    description.innerHTML = data.description;
    
    const header = document.createElement("div");
    header.className = "card-header";

    const sender = document.createElement("p");
    sender.innerHTML = "<b>Citizen</b> " + data.sender;
    sender.style =  "float: left;padding-right: 5px;";

    const body = document.createElement("div");
    body.className = "card-body";
    
    const text = document.createElement("p");
    text.className = "card-text";
    text.innerHTML = data.description;
    
    const status = document.createElement("p");
    status.className = "card-text";
    status.innerHTML = "STATUS : " + data.status;
    
    const addr = document.createElement("p");
    addr.className = "card-text";
    addr.innerHTML = "Addr : " + data.address;

    const cont = document.createElement("p");
    cont.className = "card-text";
    cont.innerHTML = "Contact : " + data.contact;

    const img = document.createElement("img")
    img.src = "/pic/edit.png"
    img.style = "float: right";
    img.width = "30"
    img.height = "30"

    img.onclick = function ()
    {
       popBox(data._id);
        console.log("click ? ");
        console.log(data._id);
        console.log(data.description);
    }

    
    if(data.status == "pending"){
        body.style = "background-color:	#BDB76B;";
    }
    else if(data.status == "Finished"){
        body.style = "background-color: #8FBC8F;";
    }
    else if(data.status == "in process"){
        body.style = "background-color: #B0C4DE;";
    }

    status.appendChild(img);
    
    header.appendChild(sender);
    header.appendChild(cardtime);

    body.appendChild(status);
    body.appendChild(text);
    body.appendChild(addr);
    body.appendChild(cont);

    if(data.status!="pending"){
      const volunteer = document.createElement("p");
      volunteer.className = "card-text";
      volunteer.innerHTML = "Volunteer: " + "me";
      body.appendChild(volunteer);
    }

        card.appendChild(header);
        card.appendChild(body);
        document.getElementById("historyOrderContainer").append(card);
      }


      function changeStatus(data){
        console.log("click ? ");
        console.log(data);
      }
/*点击弹出按钮*/
    function popBox(id) {
        var popBox = document.getElementById("popBox");
        var popLayer = document.getElementById("popLayer");
        document.getElementById('idText').innerHTML = id;
        popBox.style.display = "block";
        popLayer.style.display = "block";
    };
 

    function popDeleteBox(id){
        var popBox = document.getElementById("popDeleteBox");
        var popLayer = document.getElementById("popDeleteLayer");
        document.getElementById('idDeleteText').innerHTML = id;
        popBox.style.display = "block";
        popLayer.style.display = "block";
    }

    function closeDeleteBox(){
      var popBox = document.getElementById("popDeleteBox");
        var popLayer = document.getElementById("popDeleteLayer");
        popBox.style.display = "none";
        popLayer.style.display = "none";
    }

    /*点击关闭按钮*/
    function closeBox() {
        var popBox = document.getElementById("popBox");
        var popLayer = document.getElementById("popLayer");
        popBox.style.display = "none";
        popLayer.style.display = "none";
    }

    function cancelDelete(){
      closeDeleteBox();
    }

    function confirmDelete(){
      var orderId = document.getElementById('idDeleteText').innerHTML;
      console.log("going to delete" + orderId);
      var data = {
        "id": orderId
      }
      $.ajax({
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify(data),
                    type: 'delete',
                    url: '/deliverys/userRequests',
                    dataType: 'json',
                    headers: { "token": localStorage.getItem('token') },
                    success: function () {
                      console.log("success");
                      alert("delete success!");
                      closeDeleteBox();
                      getMyRequests();
                    }
                });
    }

    function cancelUpdate(){
      closeBox();
    }

    function confirmStatusUpdate(){
      var statusGroup=document.getElementsByName('status');
      var orderId = document.getElementById('idText').innerHTML;
                var curstatus = "undefined";
                for(i = 0; i < statusGroup.length; i++){
                    if(statusGroup[i].checked){
                        curstatus=statusGroup[i].id;
                    }
                }
                
                var data = {
                    'id': orderId,
                    'status': curstatus
                }

                $.ajax({
                    contentType: 'application/json; charset=UTF-8',
                    data: JSON.stringify(data),
                    type: 'post',
                    url: '/deliverys/requestStatus',
                    dataType: 'json',
                    headers: { "token": localStorage.getItem('token') },
                    success: function () {
                      console.log("success");
                      getVolunteerOrders();
                    }
                });

      closeBox();
    }
    
    function getPendingRequests(){
        $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'get',
        url: '/deliverys/pendingRequests',
        dataType: 'json',
        success: function (data, _, _) {
         document.getElementById("pendingRequestContainer").innerHTML = "";
          for(i in data.data){
            item = data['data'][i];
            showPendingRequests(item);
          }
        },
        error: function(jqXHR, _, _){
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
        }
      });
    }

    function showPendingRequests(data){
      var card = document.createElement('div');
        card.style = "max-width: 100%;"
        card.className = "card text-white bg-secondary mb-3"
        const cardtime = document.createElement("span")
        cardtime.style = "float: right";
        cardtime.innerHTML = data.time;
    
    const header = document.createElement("div");
    header.className = "card-header";

    const sender = document.createElement("p");
    sender.innerHTML = '<b>' + data.sender + '</b>';
    sender.style =  "float: left;padding-right: 5px;";

    const body = document.createElement("div");
    body.className = "card-body";
    
    const des = document.createElement("p");
    des.className = "card-text";
    des.innerHTML = "Description : " + data.description;
    
    const status = document.createElement("p");
    status.className = "card-text";
    status.innerHTML = "STATUS : " + data.status;
    
    const addr = document.createElement("p");
    addr.className = "card-text";
    addr.innerHTML = "Addr : " + data.address;

    const contact = document.createElement("p");
    contact.className = "card-text";
    contact.innerHTML = "Contact : " + data.contact;

    const but = document.createElement("button");
    but.innerHTML = '<button type="button" id="popup" class="btn btn-dark" > <b>Help</b></button>';
    but.onclick = function(){
        var dat = {
            "id": data._id,
            "username": curUserName
        };
    
    $.ajax({
        contentType: 'application/json; charset=UTF-8',
        type: 'post',
        url: '/deliverys/requestVolunteer',
        data: JSON.stringify(dat),
        dataType: 'json',
        success: function (_,_,jqXHR) {
            if(jqXHR.status == 304){
                alert("Sorry this request has been deleted");
            }
            else{
                alert("success! You are the Volunteer for this order now, thanks!");
            }
            getPendingRequests();
        },
    
        error: function(_,_,jqXHR){
    
            var erMsg = jQuery.parseJSON(jqXHR.responseText).errors[0].msg;
            console.log(erMsg);
            if (jqXHR.status == 503 && erMsg == "The system is meauring performance and unavalible for now. Please try agiain later") {
                alert(erMsg);
            }
            alert("Sorry, something went wrong")
        }
        
      });
    }

    header.appendChild(sender);
    header.appendChild(cardtime);

    
    if(data.status == "pending"){
        body.style = "background-color:	#BDB76B;";
    }
    else if(data.status == "Finished"){
        body.style = "background-color: #8FBC8F;";
    }
    else if(data.status == "in process"){
        body.style = "background-color: #B0C4DE;";
    }

    body.appendChild(des);
    body.appendChild(status);
    body.appendChild(addr);
    body.appendChild(contact);
    body.appendChild(but);
    
    if(data.status!="pending"){
      const volunteer = document.createElement("p");
      volunteer.className = "card-text";
      volunteer.innerHTML = "Volunteer: " + data.volunteer;
      body.appendChild(volunteer);
    }

        card.appendChild(header);
        card.appendChild(body);

        document.getElementById("pendingRequestContainer").append(card);
    }


//     function jumpToPublicWall(){
//         window.location.href = "/users/public/"+localStorage.getItem('username')
//     }
  
//     function jumpToDirectory(){
//         window.location.href = "/users/directory/"+localStorage.getItem('username')
//     }
  
//     function jumpToMeasure(){
//         window.location.href = "/users/measure/"+localStorage.getItem('username')
//     }
  
//     function jumpToAnnouncement(){
//         window.location.href = "/users/announcement/"+localStorage.getItem('username')
//     }
  
//     function jumpToProfile(){
//         window.location.href = "/users/profile/"+localStorage.getItem('username')
//     }
  
//     function jumpToEmergencyContact(){
//       window.location.href = "/emergencyContacts/"+localStorage.getItem('username')
//     }
  
//   function jumpToEmergencyContact(){
//     window.location.href = "/emergencyContacts/"+localStorage.getItem('username')
//   }
