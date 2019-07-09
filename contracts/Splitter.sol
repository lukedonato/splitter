pragma solidity 0.5.0;

import "./SafeMath.sol";

contract Splitter {
    using SafeMath for uint;

    mapping (address => uint) balances;

    event PaymentReceived(address indexed from, uint value);
    event PaymentWithdrawn(address indexed to);

    function splitPayment(address address1, address address2) payable external {
        address depositer = msg.sender;
        uint depositValue = msg.value;
        uint halfAmount;

        if (depositValue % 2 == 0) {
            halfAmount = depositValue.div(2);
        } else { // if odd amount of wei then we should store it back so depositer can claim it
            halfAmount = (depositValue - 1).div(2);
            balances[depositer] = balances[depositer].add(1);
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