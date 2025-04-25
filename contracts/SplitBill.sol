// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

contract SplitBill {

    address public owner;

    uint public totalAmount;
    uint public tipAmount;

    constructor(){
        owner = msg.sender;
    }

    receive() external payable{}

    function getBalance()public view returns(uint){
       return address(this).balance; 
    }

    function splitBill(address[] calldata recipients)external payable{
        require(msg.sender == owner, "You are not the owner");
        uint256 totalBalance = address(this).balance;
        uint256 amountPerRecipient = totalBalance / recipients.length;

        for (uint256 i = 0; i < recipients.length; i++){
            payable(recipients[i]).transfer(amountPerRecipient);
        }

    }

}