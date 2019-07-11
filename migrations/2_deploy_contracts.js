const Splitter = artifacts.require("Splitter");
const SafeMath = artifacts.require("./SafeMath.sol");
const Roles = artifacts.require("./Roles.sol");
const PausableRole = artifacts.require("./PausableRole.sol");
const Pausable = artifacts.require("./Pausable.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Splitter);
  deployer.deploy(Roles);
  deployer.deploy(PausableRole);
  deployer.deploy(Pausable);
};
