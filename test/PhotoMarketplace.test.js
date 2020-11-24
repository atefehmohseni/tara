var marketplace = artifacts.require("PhotoMarketplace");

contract("marketplace", function(accounts) {
    var marketplaceInstance;
    var name = "testphoto";
    var url = "s3.testphoto.com";
    var description = "this is a test photo";
    var price = 20;

  //check out photo counter or unique identifier for each photo
  it("verify photo counter", function() {
    return marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.addPhoto(url, name, description, price, {from: accounts[0]})
    }).then(function(receipt) {
          return marketplaceInstance.photoCounter()
      }).then(function(counter) {
      assert.equal(counter, 1, "the photo counter has been increased correctly");      
    })
  });

  //check out new added photo event
  it("verify the AddNewPhoto event", function() {
      return marketplace.deployed().then(function(instance) {
        marketplaceInstance = instance;

        return marketplaceInstance.addPhoto(url, name, description, price, { from: accounts[0] });
      }).then(function(receipt) {
          assert.equal(receipt.logs.length, 1, "an event was triggered");
          assert.equal(receipt.logs[0].event, "AddNewPhoto", "the event type is correct");
        })
      });


  //check out new added photo information
  it("verify the new added photo information", function() {
    return marketplace.deployed().then(function(instance) {
      marketplaceInstance = instance;

      return marketplaceInstance.addPhoto(url, name, description, price, {from: accounts[0]})
    }).then(function(receipt) {
          return marketplaceInstance.photos(0)
      }).then(function(newphoto) {
      assert(newphoto, "a photo has been added to the users album");
      assert.equal(newphoto[0], url, "the photo URL is valid");
      assert.equal(newphoto[2], name, "the photo name is valid");
      assert.equal(newphoto[3], description, "the photo description is valid");
      assert.equal(newphoto[4], accounts[0], "photo owner address is correct");
    })
  });


});

    