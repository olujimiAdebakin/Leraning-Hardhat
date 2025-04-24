const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("Lottery", function () {
    let manager;
    let player1, player2, player3, player4;
    let lottery;

     this.beforeEach(async () => {
         const Lottery = await ethers.getContractFactory("Lottery");
         lottery = await Lottery.deploy();
         [player1, player2, player3, player4] = await ethers.getSigners();

         await lottery
             .connect(player1)
             .enter({ value: ethers.parseEther("0.01") });
         
         await lottery
           .connect(player2)
             .enter({ value: ethers.parseEther("0.01") });
         
         await lottery
           .connect(player3)
             .enter({ value: ethers.parseEther("0.01") });
         
         
         await lottery
           .connect(player4)
           .enter({ value: ethers.parseEther("0.01") });
     });
    
    it("returns the player", async () => {
         await lottery
           .connect(player1)
           .enter({ value: ethers.parseEther("0.01") });

         await lottery
           .connect(player2)
           .enter({ value: ethers.parseEther("0.01") });

         await lottery
           .connect(player3)
           .enter({ value: ethers.parseEther("0.01") });

         await lottery
           .connect(player4)
           .enter({ value: ethers.parseEther("0.01") });
    })

})