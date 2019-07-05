pragma solidity 0.5.0;

contract Splitter {
    address public aliceAddress;
    address payable public address1;
    address payable public address2;

    mapping (address => uint) balances;

    event paymentReceived();
    event paymentWithdrawn(address indexed _to);
    
    constructor(address payable bobAddress, address payable carolAddress) public {
        // ensure both addreses are passed in when deployed
        require(address(bobAddress) != address(0) && address(carolAddress) != address(0));
        // assume alice will deploy the contract
        aliceAddress = msg.sender;
        address1 = bobAddress;
        address2 = carolAddress;

    }

    function splitPayment() payable external {
        require(msg.sender == aliceAddress);
        require(msg.value % 2 == 0);

        uint halfAmount = msg.value / 2;

        balances[address1] += halfAmount;
        balances[address2] += halfAmount;

        emit paymentReceived();
    }

    function withdrawPayment() external {
        uint withdrawerBalance = balances[msg.sender];

        require(withdrawerBalance > 0);

        balances[msg.sender] = 0;
        msg.sender.transfer(withdrawerBalance);
        
        emit paymentWithdrawn(msg.sender);
    }
}