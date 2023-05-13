const hre = require("hardhat");

const main = async () => {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const MoneyTransfer = await hre.ethers.getContractFactory("MoneyTransfer");
  const _moneyTransfer = await MoneyTransfer.deploy();

  await _moneyTransfer.deployed();

  console.log("Contract deployed to:", _moneyTransfer.address);

};



const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
runMain();