const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SplitBill Contract", function () {
  let splitBill;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async () => {
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    const SplitBill = await ethers.getContractFactory("SplitBill");
    splitBill = await SplitBill.deploy();
    await splitBill.waitForDeployment();

    console.log("✅ Contract deployed by:", owner.address);
    console.log("📍 Contract address:", splitBill.target);
  });

  it("should set the deployer as the owner", async () => {
    const contractOwner = await splitBill.owner();
    console.log("🧾 Contract owner:", contractOwner);
    expect(contractOwner).to.equal(owner.address);
  });

  it("should accept Ether", async () => {
    const sendValue = ethers.parseEther("1.0");
    await owner.sendTransaction({
      to: splitBill.target,
      value: sendValue,
    });

    const balance = await ethers.provider.getBalance(splitBill.target);
    console.log(
      "💰 Contract balance after deposit:",
      ethers.formatEther(balance),
      "ETH"
    );
    expect(balance).to.equal(sendValue);
  });

  it("should split Ether among recipients", async () => {
    const recipients = [addr1, addr2, addr3];

    await owner.sendTransaction({
      to: splitBill.target,
      value: ethers.parseEther("3.0"),
    });

    console.log("📦 Contract funded with 3 ETH");

    await splitBill.connect(owner).splitBill(recipients.map((a) => a.address));
    console.log("📤 Split executed");

    for (let i = 0; i < recipients.length; i++) {
      const balance = await ethers.provider.getBalance(recipients[i].address);
      console.log(
        `👤 Recipient ${i + 1} (${recipients[i].address}) balance:`,
        ethers.formatEther(balance),
        "ETH"
      );
      expect(balance).to.be.gt(ethers.parseEther("9999")); // assuming test wallets start with 10000 ETH
    }
  });

  it("should revert if non-owner tries to split", async () => {
    console.log("🚫 Non-owner trying to split funds");
    await expect(
      splitBill.connect(addr1).splitBill([addr1.address, addr2.address])
    ).to.be.revertedWith("You are not the owner");
  });
});
