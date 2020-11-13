var myContract = artifacts.require("UserManagement");

module.exports = function(deployer){
  deployer.deploy(myContract);
}