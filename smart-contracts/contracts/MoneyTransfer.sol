// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract MoneyTransfer {
    address owner;

    constructor() public {
        owner = msg.sender;
    }

    function transfer(address payable receiver) external payable {
        uint256 amount = msg.value;
        receiver.transfer(amount);
    }
}
