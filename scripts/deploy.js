const { ethers } = require("hardhat");


async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("deploying contracts with the account", deployer.address);

    const Lottery = await ethers.getContractFactory("Lottery");
    const deployedLottery = await Lottery.deploy();

    // console.log("Lottery address:", deployedLottery.address);

    await deployedLottery.waitForDeployment();
    console.log("lottery contract deployed to:", deployedLottery.target);
    
}

main().then(() => {
    console.log("Deployment Successful");
}).catch((error) => {
    console.error("Errror during deployment", error);
    process.exit(1);
})