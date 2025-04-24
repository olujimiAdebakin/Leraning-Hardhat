
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract SimpleContract{
    function sendEther(address payable recipient) public payable{
        require(msg.value > 0, "Must have some Ether");
        recipient.transfer(msg.value);
    }

    function getBalance(address account) public view returns(uint256){
        return account.balance;
    }
}