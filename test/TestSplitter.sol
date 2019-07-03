pragma solidity 0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Splitter.sol";

contract TestSplitter {
  function testSetOwner() public {
    Splitter splitter = Splitter(DeployedAddresses.Splitter());
    Assert.equal(splitter.aliceAddress(), msg.sender, "deployer is not owner");
  }
}
