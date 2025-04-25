// // SPDX-License-Identifier: MIT
// const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
// const { ethers } = require("hardhat");

// // StakingModule for deploying the Pandas token and StakingContract
// const StakingModule = buildModule("StakingModule", (m) => {
//   // Configuration parameters for the staking contract
//   const REWARD_RATE = ethers.parseEther("0.0001"); // 0.0001 tokens per second
//   const LOCKUP_PERIOD = 7 * 24 * 60 * 60; // 7 days in seconds
//   const REWARD_POOL_INITIAL = ethers.parseEther("10000"); // Initial reward pool funding

//   // Deploy the Pandas token first
//   const pandasToken = m.contract("Pandas", [
//     m.getAccount(0), // owner address (first account)
//   ]);

//   // Deploy the StakingContract with a reference to the Pandas token
//   const stakingContract = m.contract("StakingContract", [
//     m.getAccount(0), // owner address (first account)
//     pandasToken, // address of the previously deployed Pandas token
//     REWARD_RATE,
//     LOCKUP_PERIOD,
//   ]);

//   // Configure post-deployment steps for initialization
//   m.afterDeploy(async (env) => {
//     const deployedPandas = await env.artifacts.readDeploy("Pandas");
//     const deployedStaking = await env.artifacts.readDeploy("StakingContract");

//     console.log("Pandas Token deployed at:", deployedPandas.address);
//     console.log("StakingContract deployed at:", deployedStaking.address);

//     // Get the deployer account
//     const signer = await env.getSigner();

//     // Initialize the contracts
//     const pandasContract = await ethers.getContractAt(
//       "Pandas",
//       deployedPandas.address,
//       signer
//     );
//     const stakingContract = await ethers.getContractAt(
//       "StakingContract",
//       deployedStaking.address,
//       signer
//     );

//     // Mint additional tokens to fund the reward pool
//     await pandasContract.mint(await signer.getAddress(), REWARD_POOL_INITIAL);
//     console.log(
//       `Minted ${ethers.formatEther(
//         REWARD_POOL_INITIAL
//       )} Pandas tokens to deployer for reward pool`
//     );

//     // Approve tokens for the staking contract
//     await pandasContract.approve(deployedStaking.address, REWARD_POOL_INITIAL);
//     console.log(
//       `Approved ${ethers.formatEther(
//         REWARD_POOL_INITIAL
//       )} tokens for the staking contract`
//     );

//     // Fund the reward pool
//     await stakingContract.fundRewardPool(REWARD_POOL_INITIAL);
//     console.log(
//       `Funded reward pool with ${ethers.formatEther(
//         REWARD_POOL_INITIAL
//       )} tokens`
//     );

//     // Mint some tokens for testing
//     const testAmount = ethers.parseEther("1000");
//     await pandasContract.mint(await signer.getAddress(), testAmount);
//     console.log(
//       `Minted ${ethers.formatEther(
//         testAmount
//       )} additional Pandas tokens to deployer for testing`
//     );

//     // Output contract configuration for verification
//     console.log("\nContract configuration:");
//     console.log(" - Owner:", await stakingContract.owner());
//     console.log(" - Staking Token:", await stakingContract.stakingToken());
//     console.log(
//       " - Reward Rate:",
//       ethers.formatEther(await stakingContract.rewardRate()),
//       "tokens per second"
//     );
//     console.log(
//       " - Lockup Period:",
//       (await stakingContract.lockupPeriod()) / (24 * 60 * 60),
//       "days"
//     );
//     console.log(
//       " - Initial Reward Pool:",
//       ethers.formatEther(await stakingContract.getRewardPoolBalance()),
//       "tokens"
//     );
//   });

//   return {
//     pandasToken,
//     stakingContract,
//   };
// });

// module.exports = StakingModule;


const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");
const { parseEther } = require("ethers");

module.exports = buildModule("StakingModule", (m) => {
  const rewardRate = parseEther("0.0001"); // 0.0001 tokens per second
  const lockupPeriod = 7 * 24 * 60 * 60; // 7 days

  // Deploy Pandas token
  const pandasToken = m.contract("Pandas", [m.getAccount(0)]);

  // Deploy StakingContract
  const stakingContract = m.contract("StakingContract", [
    m.getAccount(0),
    pandasToken,
    rewardRate,
    lockupPeriod,
  ]);

  return {
    pandasToken,
    stakingContract,
  };
});
