
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleContract", function () {
    let simpleTransaction;
    let sender;
    let receiver;

    this.beforeEach(async () => {
        [sender, receiver] = await ethers.getSigners();
        const SimpleTransaction = await ethers.getContractFactory("SimpleContract"); //connect the contract
       simpleTransaction = await SimpleTransaction.deploy();
    });

    it("Transfer", async () => {
       const amount = ethers.parseEther("1");
         await simpleTransaction.connect(sender).sendEther(receiver.address, { value: amount });
        const senderBalance = await ethers.provider.getBalance(sender.address);
        console.log(senderBalance.toString());
    });
})