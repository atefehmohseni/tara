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
          return instance.users[account[0]];
        }).then(function(result) {
         if(result)
         {
            $("#accountAddress").html("Welcome " + result);
            $("#signupbtn").hide();
         }
         else {
          $("#accountAddress").html("account " + account);

         }
        }).catch(function(err) {
          console.error(err);
        });

      }
    });
    loader.hide();
    content.show();
    // Load contract data
    // App.contracts.Election.deployed().then(function(instance) {
    //   electionInstance = instance;
    //   return electionInstance.candidatesCount();
    // }).then(function(candidatesCount) {
    //   var candidatesResults = $("#candidatesResults");
    //   candidatesResults.empty();

    //   var candidatesSelect = $('#candidatesSelect');
    //   candidatesSelect.empty();

    //   for (var i = 1; i <= candidatesCount; i++) {
    //     electionInstance.candidates(i).then(function(candidate) {
    //       var id = candidate[0];
    //       var name = candidate[1];
    //       var voteCount = candidate[2];

    //       // Render candidate Result
    //       var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>"
    //       candidatesResults.append(candidateTemplate);

    //       // Render candidate ballot option
    //       var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
    //       candidatesSelect.append(candidateOption);
    //     });
    //   }
    //   return electionInstance.voters(App.account);
    // }).then(function(hasVoted) {
    //   // Do not allow a user to vote
    //   if(hasVoted) {
    //     $('form').hide();
    //   }
    //   loader.hide();
    //   content.show();
    // }).catch(function(error) {
    //   console.warn(error);
    // });
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
    var password = $("#pwd").val();
    var email = $("#email").val();
    var dob = alert($("#dob").val());

      App.contracts.UserManagement.deployed().then(function(instance) {
        return instance.userSignUp(username, password, email, dob, App.account, { from: App.account });
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

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
