pragma solidity 0.5.0;

import "./SafeMath.sol";
import "./Pausable.sol";

contract Splitter is Pausable {
    using SafeMath for uint;

    mapping (address => uint) balances;

    event PaymentReceived(address indexed from, uint indexed value, address to1, address to2);
    event PaymentWithdrawn(address indexed to, uint indexed amountWithdrawn);

    function splitPayment(address address1, address address2) payable external returns (bool) {
        require(address(address1) != address(0));
        require(address(address2) != address(0));

        uint divByTwo = msg.value.div(2);
        balances[address1] = balances[address1].add(divByTwo));
        balances[address2] = balances[address2].add(divByTwo));
        balances[msg.sender] = balances[msg.sender].add(msg.value.mod(2));

        emit PaymentReceived(msg.sender, msg.value, address1, address2);

        return true;
    }

    function getAddressBalance() public view returns (uint) {
        return balances[msg.sender];
    }

    function withdrawPayment() external returns (bool) {
        uint withdrawerBalance = balances[msg.sender];
        require(withdrawerBalance > 0);
        
        balances[msg.sender] = 0;
        emit PaymentWithdrawn(msg.sender, withdrawerBalance);

        msg.sender.transfer(withdrawerBalance);   

        return true;
    }
}