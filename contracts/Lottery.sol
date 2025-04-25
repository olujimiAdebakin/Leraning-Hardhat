
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;


contract Lottery{
    address public manager;
    address[] public players;
    event winnerPicked(address indexed winner);

    constructor(){
        manager = msg.sender;
    }

    event winnerPicked(address indexed winner, uint256 winnings);

    modifier onlyManager(){
        require(msg.sender == manager, "You are not the manager");
        _;
    }

    function enter()public payable{
        require(msg.value == 0.01 ether, "Deposit must be greater than 0");
        players.push(msg.sender);
    }

    function returnEntered() public view returns(address[] memory){
        return players;
    }

    function pickWinner() public onlyManager returns(uint256){
        require(players.length > 0, "There are no players in the lottery");
        uint256 randomIndex = uint256(keccak256((abi.encodePacked(block.prevrandao, block.timestamp, players)))) % players.length;
        address payable winner = payable(players[randomIndex]);
        uint256 winnings = address(this).balance;
        payable(winner).transfer(winnings);
        players = new address[](0);
        emit winnerPicked(winner, winnings);
        return randomIndex;
    }

}