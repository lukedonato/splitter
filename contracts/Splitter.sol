pragma solidity ^0.5.2;

contract Splitter {
    address public aliceAddress;
    address public bobAddress;
    address public carolAddress;

    constructor(address bobAddress, address carolAddress) public {
        // assume alice will deploy the contract
        aliceAddress = msg.sender;
        bobAddress = bobAddress;
        carolAddress = carolAddress;

    }

    function() payable public {
        require(msg.sender == owner);
        bobAddress.transfer(msg.value / 2);
        carolAddress.transfer(msg.value / 2);
    }
}
