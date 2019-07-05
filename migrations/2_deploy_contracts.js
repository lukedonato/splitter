const ConvertLib = artifacts.require("ConvertLib");
const Splitter = artifacts.require("Splitter");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, Splitter);
  deployer.deploy(Splitter);
};
