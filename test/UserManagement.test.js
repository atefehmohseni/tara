var usrmngmnt = artifacts.require("UserManagement");

function keccak256(...args) {
    args = args.map(arg => {
      if (typeof arg === 'string') {
        if (arg.substring(0, 2) === '0x') {
            return arg.slice(2)
        } else {
            return web3.utils.toHex(arg).slice(2)
        }
      }
  
      if (typeof arg === 'number') {
        return leftPad((arg).toString(16), 64, 0)
      } else {
        return ''
      }
    })
  
    args = args.join('')
  
    return web3.utils.sha3(args, { encoding: 'hex' })
  }

//CONSTRUCTOR TEST'
//
contract("usrmngmnt", function(accounts) {
    var usrmngmntInstance;
  
    // it("initializes a new UserManagement", function() {
    //   return usrmngmnt.deployed().then(function(instance) {
    //     return instance.users().length;
    //   }).then(function(count) {
    //     assert.equal(count, 0);
    //   });
    // });

  //check out new signup user info -> activate=true, business=false
  it("verify the initial values of a newly signed up user", function() {
      return usrmngmnt.deployed().then(function(instance) {
        usrmngmntInstance = instance;
        
        var username = "testuser";
        var email = "test@email.com";
        var userID = keccak256(email);

        return usrmngmntInstance.userSignUp(username, email, accounts[0], { from: accounts[0] });
      }).then(function(receipt) {
          var username = "testuser";
          // var userID = keccak256("test@email.com");

          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "newSignUP", "the event type is correct");
          assert.equal(receipt.logs[0].args._useraddress, accounts[0], "the user name is correct");
          // assert.equal(receipt.logs[0].args._userID, userID, "the user ID is correct");
          
          return usrmngmntInstance.users(accounts[0])})
        .then(function(newuser) {
          assert(newuser, "the user has been added to the list of users");
          assert.equal(newuser[0], "testuser", "the user name is valid");
          assert.equal(newuser[1], "test@email.com", "the user email is valid");
          assert.equal(newuser[4], true, "the user has been activated");
          assert.equal(newuser[5], false, "all new users defined as regular account (not business account)");
      })
    });

  //duble signup with the same email
  it("prevent two signup with the same email", function() {
      return usrmngmnt.deployed().then(function(instance) {
        usrmngmntInstance = instance;
        
        var username = "testuser";
        var email = "test@email.com";
        var userID = keccak256(email);

        return usrmngmntInstance.userSignUp(username, email, accounts[0], { from: accounts[0] });
      }).then(function(receipt) {
        var email = "test@email.com";

        assert.equal(receipt.logs.length, 1, "an event was triggered");
        assert.equal(receipt.logs[0].event, "failedSignUp", "the event type is correct");
        assert.equal(receipt.logs[0].args._email, email, "the user email in the failed signup error is correct");
      })
    });

  //check out new business signup user info
  it("verify the initial values of a newly business signed up account", function() {
    return usrmngmnt.deployed().then(function(instance) {
      usrmngmntInstance = instance;
      
      var companyname = "test company";
      var companydescription = "we are into fasions!";

      return usrmngmntInstance.businessSignUp(companyname, companydescription,{ from: accounts[0] });
    }).then(function(receipt) {
        var companyname = "test company";

        assert.equal(receipt.logs.length, 1, "an event was triggered");
        assert.equal(receipt.logs[0].event, "newBusinessSignUp", "the event type is correct");
        assert.equal(receipt.logs[0].args._companyname, companyname, "the business name is correct");
        
        return usrmngmntInstance.businessInfo(accounts[0])})
      .then(function(newbusiness) {
        assert(newbusiness, "the business inf has been added to the list of businesses");
        assert.equal(newbusiness[0], "test company", "the business name is valid");
        assert.equal(newbusiness[1], "we are into fasions!", "the business description is valid");
        
    })
  });

  // check out upgraded regular account to a business account
  it("verify the upgraded regular user account", function() {
    return usrmngmnt.deployed().then(function(instance) {
      usrmngmntInstance = instance;

      return usrmngmntInstance.users(accounts[0])
    }).then(function(upgradeduser) {
      assert.equal(upgradeduser[5], true, "verified upgraded user account to a business account");
        
    })
  });

});
