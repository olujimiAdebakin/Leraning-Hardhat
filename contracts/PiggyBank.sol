

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract PiggyBank {
    mapping(address => uint256) public balances;

    function deposit()public payable{
        require(msg.value > 0, "Deposit must be greater than 0");
        balances[msg.sender] += msg.value;
    }

    function withdraw(uint amount)public{
        require(balances[msg.sender] >= amount, "Not enough balance");
        require(amount > 0, "Amount must be greater than 0");
        balances[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    function checkBalance() public view returns(uint256){
        return balances[msg.sender];
    }

}