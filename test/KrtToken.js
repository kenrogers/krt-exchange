const { expect } = require("chai");
const { ethers } = require("hardhat");

let Token, hardhatToken, owner, addr1, addr2;

beforeEach(async function () {
  [owner, addr1, addr2] = await ethers.getSigners();

  // Set up the token
  Token = await ethers.getContractFactory("KrtToken");

  hardhatToken = await Token.deploy();
});

describe("KrtToken contract", function () {
  it("should assign the total supply of tokens to the owner", async function () {
    // Finds the first item in the signers array, a list of accounts in the current node
    const [owner] = await ethers.getSigners();

    const ownerBalance = await hardhatToken.balanceOf(owner.address);

    expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
  });

  it("should transfer tokens between accounts", async function () {
    // Transfer 100 tokens from owner to addr1
    await hardhatToken.transfer(addr1.address, 100);
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(100);

    // Connect to addr1 account and send 50 tokens to addr2
    await hardhatToken.connect(addr1).transfer(addr2.address, 50);

    // Check to see if account balances are correct
    expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);
    expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
  });
});
