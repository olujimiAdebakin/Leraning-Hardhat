
const { expect } = require('chai');
const { ethers } = require('hardhat');


describe("PiggyBank", function () {
    let piggyBank;
    let sender;

    this.beforeEach(async () => {
        [sender] = await ethers.getSigners();
        const PiggyBank = await ethers.getContractFactory("PiggyBank");
        piggyBank = await PiggyBank.deploy();
    });

    it("Deposit", async () => {
        await piggyBank.connect(sender).deposit({ value: ethers.parseEther("1") });
        const balance = await piggyBank.checkBalance();
        console.log(balance.toString());
        expect(balance).to.equal(ethers.parseEther("1"));
    });

    it("Withdraw", async () => {
        // first deposit
        await piggyBank.connect(sender).deposit({ value: ethers.parseEther("1")});
        
        // withdraw 0.5 ETH
        await piggyBank.connect(sender).withdraw(ethers.parseEther("0.5"));
        
        // check remaining balance
        const balance = await piggyBank.checkBalance();
        console.log(balance.toString());

        expect(balance).to.equal(ethers.parseEther("0.5"));
    })
})
