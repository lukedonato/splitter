pragma solidity 0.5.0;

import "./SafeMath.sol";

contract Splitter {

    using SafeMath for uint;

    address public aliceAddress;
    address payable public address1;
    address payable public address2;

    mapping (address => uint) balances;

    event PaymentReceived(address indexed from, uint value);
    event PaymentWithdrawn(address indexed to);
    
    constructor(address payable bobAddress, address payable carolAddress) public {
        // ensure both addreses are passed in when deployed
        require(address(bobAddress) != address(0));
        require(address(carolAddress) != address(0));
        // assume alice will deploy the contract
        aliceAddress = msg.sender;
        address1 = bobAddress;
        address2 = carolAddress;

    }

    function splitPayment() payable external {
        require(msg.sender == aliceAddress);
        uint halfAmount;

        if (msg.value % 2 == 0) {
            halfAmount = msg.value.div(2);
        } else { // if odd amount of wei then we should store it back so depositer can claim it
            halfAmount = (msg.value - 1).div(2);
            balances[aliceAddress] = balances[aliceAddress].add(1);
        }

        balances[address1] = balances[address1].add(halfAmount);
        balances[address2] = balances[address2].add(halfAmount);

        emit PaymentReceived(msg.sender, msg.value);
    }

    function withdrawPayment() external {
        uint withdrawerBalance = balances[msg.sender];

        require(withdrawerBalance > 0);

        balances[msg.sender] = 0;
        emit PaymentWithdrawn(msg.sender);

        msg.sender.transfer(withdrawerBalance);   
    }
}