// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MoneyTransfer {
    
    mapping(address => uint256) balances;
    
    function transfer(address recipient) payable external {
        require(msg.value > 0, "Amount must be greater than zero.");
        require(recipient != address(0), "Recipient address is invalid.");
        require(msg.sender != recipient, "Sender and recipient cannot be the same.");
        
        uint256 amount = msg.value;
        balances[msg.sender] -= amount;
        balances[recipient] += amount;
    }
    
    function getBalance() view external returns(uint256) {
        return balances[msg.sender];
    }
    
}