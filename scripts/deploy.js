// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const KrtToken = await hre.ethers.getContractFactory("KrtToken");
  const krtToken = await KrtToken.deploy();

  const KrtExchange = await hre.ethers.getContractFactory("KrtExchange");
  // Don't forget to pass in the token address to the constructor
  const krtExchange = await KrtExchange.deploy(krtToken.address);

  await krtToken.deployed();
  await krtExchange.deployed();

  console.log("KrtToken deployed to:", krtToken.address);
  console.log("KrtExchange deployed to:", krtExchange.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
