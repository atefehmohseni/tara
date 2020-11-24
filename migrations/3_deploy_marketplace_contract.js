var myContract = artifacts.require("PhotoMarketplace");

module.exports = function(deployer){
  deployer.deploy(myContract);
}