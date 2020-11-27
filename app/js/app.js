App = {
  web3Provider: null,
  contracts: {},
  
  state : {
    ipfsHash: '',
    buffer: null,
    account: null
  },

  init: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },
  
  
  initContract: function() {
    $.getJSON("UserManagement.json", function(usermanagement) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.UserManagement = TruffleContract(usermanagement);
      // Connect provider to interact with contract
      App.contracts.UserManagement.setProvider(App.web3Provider);

    });
    $.getJSON("PhotoMarketplace.json", function(marketplace) {
      //Instantiate the photo marketplace contract
      App.contracts.PhotoMarketplace = TruffleContract(marketplace);
      App.contracts.PhotoMarketplace.setProvider(App.web3Provider);
    });
    return App.render();
  },

  render: function() {
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        // check if the user has already registered
        App.contracts.UserManagement.deployed().then(function(instance) {
            instance.users(account).then(function(user_info){
              console.log(user_info);
              if(user_info[4] != "0x0000000000000000000000000000000000000000"){
                $("#accountAddress").html("Welcome " + user_info[0]);//user_info[0] : username
                $("#accountAddress").show();
                $("#signupbtn").hide();
              }
              
              App.renderPhotoshooting();
              
              App.renderRecentPhotos();

            }).catch(function(err) {
          console.error(err);
          $("#accountAddress").html("account " + account);
        });
      });
    }
    loader.hide();
    content.show();
  });
  },

  renderPhotoshooting: function(){
      var section = $("#photorequests");
      section.empty();

      App.contracts.PhotoMarketplace.deployed().then(function(instance) {
        marketplace = instance;
        return marketplace.photographyRequestCounter();
      }).then(function(photorequestCounter) {
        var requestTemplate;

        for (var i = 1; i <= photorequestCounter; i++){
            marketplace.photographyRequests(i).then(function(request) {
            var url = `https://ipfs.io/ipfs/${request[1]}`;
            var price = request[3];
            var requestID = request[4];
            requestTemplate +=  "<th><div position='relative'> <img position='absolute' width='200' height='200' src="+ url +" alt=''/> \
                                <button onclick=App.showDescription("+requestID+")> <img width='25' height='25' src='images/money.jpg'/>"+price+"</td></button>\
                                </div></th>";

            section.append(requestTemplate);
            requestTemplate = "";
          });
      }
      }).catch(function(err) {
        console.error(err);
      });    
  },

  renderRecentPhotos: function(){
    var section = $("#photos");
    section.empty();

    App.contracts.PhotoMarketplace.deployed().then(function(instance){
      marketplace = instance;
      return marketplace.photoCounter();
    }).then(function(photoCounter) {      
      var requestTemplate = "";
      var rowcounter=0;

      for (var i = 1; i <= photoCounter; i++){
          marketplace.photos(i).then(function(photo) {
          var url = `https://ipfs.io/ipfs/${photo[0]}`;
          var price = photo[5];
          var photoID = photo[1];
          
          requestTemplate += "<th><div position='relative'> <img position='absolute' width='300' height='200' src="+ url +" alt=''/> \
                              <button onclick=App.buyPhoto("+photoID+")> <img width='25' height='25' src='images/money.jpg'</div>"+price+"</td></button></div></th>";
        
          section.append(requestTemplate);
          requestTemplate = "";
          
          rowcounter +=1;
          if (rowcounter % 3 == 0)
            section.append("<tr ></tr>");
        });
    }// end for
    
    }).catch(function(err) {
      console.error(err);
    });    
  },

  renderSignup: function(event) {
    var content = $("#content");
    var signupForm = $("#signupform");
    var signupbtn = $("#signupbtn");
    var photography = $("#photographyRequest");

    signupbtn.hide();
    content.hide();
    signupForm.show();
    photography.hide();
  },

  handleSignup: function(event) {    
    var username = $('#username').val();
    var email = $("#email").val();
    var businesscheck = $("#businessCheck").checked;

      App.contracts.UserManagement.deployed().then(function(instance) {
        return instance.userSignUp(username, email, App.account, { from: App.account });
      }).then(function(result) {
        // Wait for user list to update
        $("#content").hide();
        $("#loader").show();
        console.log(businesscheck);
        if(businesscheck){
          console.log("yesss business account!");
          App.handleBusinessSignup();
        }
      }).catch(function(err) {
        console.error(err);
      });

  },
  showBusinessAccountField: function(event){
    $("#compname").show();
    $("#compdesc").show();
  },
  handleBusinessSignup: function(event) {
    var businessname = $("#companyname");
    var businessdesc = $("#companydescription");

    App.contracts.UserManagement.deployed().then(function(instance) {
      return instance.businessSignUp(businessname, businessdesc, { from: App.account });
    }).then(function(result) {
      // Wait for user list to update
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  renderProfile: function(event){
      var content = $("#content");
      content.hide();
      
      //window.location.replace("profile.html");
      //window.location.href = "profile.html";
      $("#profile").show();
  },

  addPhoto: function(url){
    var photoname = $("#phototitle").val();
    var description = $("#photodesc").val();
    var price = $("#photoprice").val();

    App.contracts.PhotoMarketplace.deployed().then(function(instance) {
      return instance.addPhoto(url, photoname, description, price, { from: App.account });
    }).then(function(result) {
      // Wait for photo to added to blockchain
      $("#profile").hide();
      $("#content").show();
    }).catch(function(err) {
      console.error(err);
    });
  },

  renderBusinessProfile: function(){
    var content = $("#content");
    content.hide();
    
    //window.location.replace("profile.html");
    //window.location.href = "profile.html";
    $("#photographyRequest").show();
  },

  addPhotographyRequest: function(url){
      var desc = $("#photoshootingdesc").val();
      var price = $("#photoshootingprice").val();
     
      App.contracts.PhotoMarketplace.deployed().then(function(instance) {
        return instance.addPhotographyRequest(url, desc, price, { from: App.account });
      }).then(function(result) {
        // Wait for photo to added to blockchain
        $("#profile").hide();
        $("#content").show();
      }).catch(function(err) {
        console.error(err);
      });
  },
  
  buyPhoto: function(photoID) {
    App.contracts.PhotoMarketplace.deployed().then(function (instance) {
      instance.sellPhoto(photoID).then(function(res) {
          if (!res){
            alert("You can't buy this photo!");
          }
      }).catch(function(err) {
        console.error(err);
      });      
    });
  },

  showDescription: function(requestID) {
    App.contracts.PhotoMarketplace.deployed().then(function (instance) {
      instance.photographyRequests(requestID,{ from: App.account }).then(function(request) {
        console.log(request);
        //TODO: add tooltip to show the description
       // alert(request[2]);
      }).catch(function(err) {
        console.error(err);
      });      
    });
  }

};

$(function() {
  $(window).load(function() {
    //ethereum.enable();
    App.init();
  });
});