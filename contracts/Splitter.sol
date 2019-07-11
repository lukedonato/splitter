pragma solidity 0.5.0;

import "./SafeMath.sol";
import "./Pausable.sol";

contract Splitter is Pausable {
    using SafeMath for uint;

    mapping (address => uint) balances;

    event PaymentReceived(address indexed from, uint indexed value, address to1, address to2);
    event PaymentWithdrawn(address indexed to, uint indexed amountWithdrawn);

    function splitPayment(address address1, address address2) payable external {
        require(address(address1) != address(0));
        require(address(address2) != address(0));

        balances[address1] = balances[address1].add(msg.value.div(2));
        balances[address2] = balances[address2].add(msg.value.div(2));
        balances[msg.sender] = balances[msg.sender].add(msg.value % 2);

        emit PaymentReceived(msg.sender, msg.value, address1, address2);
    }

    function getAddressBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    function withdrawPayment() external {
        require(balances[msg.sender] > 0);

        balances[msg.sender] = 0;
        emit PaymentWithdrawn(msg.sender, balances[msg.sender]);

        msg.sender.transfer(balances[msg.sender]);   
    }
}