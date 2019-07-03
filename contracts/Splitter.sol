pragma solidity 0.5.0;

contract Splitter {
    address public aliceAddress;
    address payable public address1;
    address payable public address2;

    event Transfer(uint256 indexed _aliceBalance, uint256 indexed _bobBalance, uint256 _CarolBalance);
    
    constructor(address payable bobAddress, address payable carolAddress) public {
        // assume alice will deploy the contract
        aliceAddress = msg.sender;
        address1 = bobAddress;
        address2 = carolAddress;

    }

    function() payable external {
        require(msg.sender == aliceAddress);
        address1.transfer(msg.value / 2);
        address2.transfer(msg.value / 2);
        emit Transfer(aliceAddress.balance, address1.balance, address2.balance);
    }
}
