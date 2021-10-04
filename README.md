# KRT Exchange

A simple DEX built using React, Hardhat, Tailwind, and Solidity.

Uses an ERC20 standard to create the Ken Rogers Token (KRT) and allows the user to exchange this token for ETH.

## Setup

1. Install dependencies with `yarn`
2. Compile smart contracts with `npx hardhat compile`
3. Test that everything is working with `npx hardhat test`

Once we verify that all test are passing, we can set up our Hardhat node with `npx hardhat node`.

That will give us a list of addresses and private keys that we can use for testing purposes.

![image](https://user-images.githubusercontent.com/7418051/135921045-7958c8b0-8a14-479a-a973-1104e4882fb7.png)

Next up, deploy the smart contract to our local Hardhat network with our `deploy.js` script. We can do that by running `npx hardhat run scripts/deploy.js --network localhost` in another terminal window.

This will give us an address where our newly deployed contract lives.

Now that we've got the test network running and contract deployed, we can start up the React app with `yarn start` and connect to it with MetaMask to start exchanging some KRT for some ETH.

You're on your way to becoming mind-blowingly wealthy with the world's greatest token, the Kenny Rogers Token (KRT).
