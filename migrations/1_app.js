const AppContract = artifacts.require("./app.sol");

module.exports = function(deployer) {
  deployer.deploy(AppContract);
};
