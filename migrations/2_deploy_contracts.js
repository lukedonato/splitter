const Splitter = artifacts.require("Splitter");
const SafeMath = artifacts.require("./SafeMath.sol");

module.exports = function(deployer) {
  deployer.deploy(SafeMath);
  deployer.link(SafeMath, Splitter);
  deployer.deploy(Splitter);
};
