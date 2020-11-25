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
                $("#signupbtn").hide();
              }
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

  renderSignup: function(event) {
    var content = $("#content");
    var signupForm = $("#signupform");
    var signupbtn = $("#signupbtn");

    signupbtn.hide();
    content.hide();
    signupForm.show();

  },

  handleSignup: function(event) {    
    var username = $('#username').val();
    var email = $("#email").val();

      App.contracts.UserManagement.deployed().then(function(instance) {
        return instance.userSignUp(username, email, App.account, { from: App.account });
      }).then(function(result) {
        // Wait for user list to update
        $("#content").hide();
        $("#loader").show();
      }).catch(function(err) {
        console.error(err);
      });
  },

  handleBusinessSignup: function(event) {
    $("#compname").show();
    $("#compdesc").show();

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

  addPhoto: function(url, title, desc, price){
    var photoname = $("#phototitle").val();
    var description = $("#photodesc").val();
    var price = $("#photoprice").val();

    App.contracts.PhotoMarketplace.deployed().then(function(instance) {
      return instance.addPhoto(url, photoname, description, price, { from: App.account });
    }).then(function(result) {
      // Wait for photo to added to blockchain
      $("#content").hide();
      $("#loader").show();
    }).catch(function(err) {
      console.log("FUCK It");
      console.error(err);
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});