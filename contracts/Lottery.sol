
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;


contract Lottery{
    address public manager;
    address[] public players;


    constructor(){
        manager = msg.sender;
    }

    function enter()public payable{
        require(msg.value == 0.01 ether, "Deposit must be greater than 0");
        players.push(msg.sender);
    }

}