// const { expect } = require("chai");
// const { ethers } = require("hardhat");

// describe("Lottery", function () {
//   let manager, player1, player2, player3, player4;
//   let lottery;

//   beforeEach(async () => {
//     const Lottery = await ethers.getContractFactory("Lottery");
//     [manager, player1, player2, player3, player4] = await ethers.getSigners();

//     lottery = await Lottery.connect(manager).deploy();

//     await lottery.connect(player1).enter({ value: ethers.parseEther("0.01") });
//     await lottery.connect(player2).enter({ value: ethers.parseEther("0.01") });
//     await lottery.connect(player3).enter({ value: ethers.parseEther("0.01") });
//     await lottery.connect(player4).enter({ value: ethers.parseEther("0.01") });
//   });

//   it("allows players to enter the lottery", async () => {
//     const players = await lottery.returnEntered();
//     expect(players.length).to.equal(4);
//     expect(players).to.include(player1.address);
//     expect(players).to.include(player2.address);
//     expect(players).to.include(player3.address);
//     expect(players).to.include(player4.address);
//   });

//   it("only manager can call pickWinner", async () => {
//     await expect(lottery.connect(player1).pickWinner()).to.be.revertedWith(
//       "You are not the manager"
//     );
//   });

//   it("picks a winner, transfers balance, and resets players", async () => {
//     const initialBalances = await Promise.all(
//       [player1, player2, player3, player4].map(async (p) =>
//         ethers.provider.getBalance(p.address)
//       )
//     );

//     // Pick winner as manager
//     const tx = await lottery.connect(manager).pickWinner();
//     const receipt = await tx.wait();

//     // Check event emitted
//     const event = receipt.events.find((e) => e.event === "winnerPicked");
//     expect(event).to.exist;

//     const winner = event.args.winner;
//     const winnings = event.args.winnings;

//     // Ensure winnings is 0.04 ETH
//     expect(winnings).to.equal(ethers.parseEther("0.04"));

//     // Ensure contract balance is now 0
//     const contractBalance = await ethers.provider.getBalance(lottery.address);
//     expect(contractBalance).to.equal(0);

//     // Players array reset
//     const playersAfter = await lottery.returnEntered();
//     expect(playersAfter.length).to.equal(0);
//   });

//   it("reverts if no players entered", async () => {
//     const Lottery = await ethers.getContractFactory("Lottery");
//     const freshLottery = await Lottery.connect(manager).deploy();

//     await expect(freshLottery.connect(manager).pickWinner()).to.be.revertedWith(
//       "There are no players in the lottery"
//     );
//   });

//   it("reverts if deposit is not exactly 0.01 ETH", async () => {
//     await expect(
//       lottery.connect(player1).enter({ value: ethers.parseEther("0.02") })
//     ).to.be.revertedWith("Deposit must be greater than 0");
//   });
// });



const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lottery", function () {
  let Lottery, lottery, manager, players;

  beforeEach(async function () {
    [manager, ...players] = await ethers.getSigners();
    Lottery = await ethers.getContractFactory("Lottery");
    lottery = await Lottery.deploy();
  });

  it("should allow users to enter and pick a winner", async function () {
    // 3 players enter the lottery
    for (let i = 0; i < 3; i++) {
      await lottery
        .connect(players[i])
        .enter({ value: ethers.parseEther("0.01") });
    }

    // Check that players array is populated
    const enteredPlayers = await lottery.returnEntered();
    expect(enteredPlayers.length).to.equal(3);

    // Get contract balance before winner is picked
    const contractBalance = await ethers.provider.getBalance(lottery.address);
    expect(contractBalance).to.equal(ethers.parseEther("0.03"));

    // Pick winner
    const tx = await lottery.connect(manager).pickWinner();
    const receipt = await tx.wait();

    // Check that WinnerPicked event is emitted
    const event = receipt.events.find((e) => e.event === "winnerPicked");
    expect(event).to.exist;
    const winner = event.args.winner;

    // Check winner is one of the players
    expect(enteredPlayers).to.include(winner);

    // Players array should be reset
    const playersAfter = await lottery.returnEntered();
    expect(playersAfter.length).to.equal(0);

    // Contract balance should be 0
    const finalBalance = await ethers.provider.getBalance(lottery.address);
    expect(finalBalance).to.equal(0);
  });

  it("should revert if pickWinner is called by non-manager", async function () {
    await expect(lottery.connect(players[0]).pickWinner()).to.be.revertedWith(
      "You are not the manager"
    );
  });

  it("should revert if no players entered", async function () {
    await expect(lottery.connect(manager).pickWinner()).to.be.revertedWith(
      "There are no players in the lottery"
    );
  });

  it("should revert if wrong ETH amount is sent", async function () {
    await expect(
      lottery
        .connect(players[0])
        .enter({ value: ethers.parseEther("0.02") })
    ).to.be.revertedWith("Deposit must be greater than 0");
  });
});
