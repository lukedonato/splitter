const Splitter = artifacts.require("Splitter");
const SafeMath = artifacts.require("../contracts/SafeMath.sol");
const Roles = artifacts.require("../contracts/Roles.sol");
const PausableRole = artifacts.require("../contracts/PausableRole.sol");
const Pausable = artifacts.require("../contracts/Pausable.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.deploy(Roles);
  deployer.deploy(PausableRole);
  deployer.deploy(Pausable);
  deployer.deploy(Splitter);
};
