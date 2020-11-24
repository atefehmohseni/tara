App = {
  web3Provider: null,
  contracts: {},

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

      App.listenForEvents();

      return App.render();
    });
  },

  listenForEvents: function() {
    // App.contracts.UserManagement.deployed().then(function(instance) {
    //   // Restart Chrome if you are unable to receive this event
    //   // This is a known issue with Metamask
    //   // https://github.com/MetaMask/metamask-extension/issues/2393
    //   instance.newBidEvent({}, {
    //     fromBlock: 0,
    //     toBlock: 'latest'
    //   }).watch(function(error, event) {
    //     console.log("event triggered", event)
    //     // Reload when a new vote is recorded
    //     App.render();
    //   });
    // });
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

      $("#profile").load("profile.html");
  },

  captureFile: function(event) {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) })
      console.log('buffer', this.state.buffer)
    }
  },

  onSubmit: function(event) {
    event.preventDefault()
    ipfs.files.add(this.state.buffer, (error, result) => {
      if(error) {
        console.error(error)
        return
      }
      this.PhotoMarketplace.addPhoto(result[0].hash, { from: this.state.account }).then((r) => {
        return this.setState({ ipfsHash: result[0].hash })
        console.log('ifpsHash', this.state.ipfsHash)
      })
    })
  },


};

$(function() {
  $(window).load(function() {
    App.init();
  });
});