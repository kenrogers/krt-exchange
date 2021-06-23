const { expect } = require("chai");
const { ethers } = require("hardhat");

let KrtToken,
  KrtExchange,
  hardhatKrtToken,
  hardhatKrtExchange,
  owner,
  addr1,
  rate;

// Utility function for working with token decimal conversion
function tokens(amount) {
  return ethers.utils.parseEther(amount);
}

beforeEach(async function () {
  [owner, addr1] = await ethers.getSigners();

  KrtToken = await ethers.getContractFactory("KrtToken");

  hardhatKrtToken = await KrtToken.deploy();

  KrtExchange = await ethers.getContractFactory("KrtExchange");

  // Pass in our KrtToken here as the constructor argument
  hardhatKrtExchange = await KrtExchange.deploy(hardhatKrtToken.address);

  // Set the exchange rate
  rate = 100;

  // Transfer all tokens to the KrtExchange contract
  await hardhatKrtToken.transfer(
    hardhatKrtExchange.address,
    (await hardhatKrtToken.totalSupply()).toString()
  );
});

describe("KrtExchange contract", function () {
  it("should have the correct name", async function () {
    const name = await hardhatKrtExchange.getName();

    expect(name).to.equal("KrtExchange Instant Exchange");
  });

  it("should get total supply of KrtTokens", async function () {
    const exchangeBalance = (
      await hardhatKrtToken.balanceOf(hardhatKrtExchange.address)
    ).toString();
    const tokenSupply = (await hardhatKrtToken.totalSupply()).toString();
    expect(exchangeBalance).to.equal(tokenSupply);
  });

  it("should be able to send tokens to buyers", async function () {
    // Check buyer ether before buying tokens
    const buyerEthStarting = await ethers.provider.getBalance(addr1.address);

    const result = await hardhatKrtExchange.connect(addr1).buyTokens({
      value: ethers.utils.parseEther("2.0"),
    });

    const addr1Balance = await hardhatKrtToken.balanceOf(addr1.address);
    const exchangeBalance = await hardhatKrtToken.balanceOf(
      hardhatKrtExchange.address
    );
    const exchangeEth = await ethers.provider.getBalance(
      hardhatKrtExchange.address
    );
    const buyerEth = await ethers.provider.getBalance(addr1.address);

    // Check that buyer received tokens after purchase and their ether balance decreased
    expect(addr1Balance.toString()).to.equal(
      (ethers.utils.parseEther("2.0") * rate).toString()
    );
    expect(parseInt(buyerEth)).to.be.lessThan(parseInt(buyerEthStarting));

    // Check that KrtExchange tokens have decreased proportionally and ether has increased
    expect(exchangeBalance.toString()).to.equal(tokens("999800"));
    expect(exchangeEth).to.equal(ethers.utils.parseEther("2.0"));

    const res = await result.wait();
    const eventArgs = res.events.find(
      (e) => e.event == "KrtTokensPurchased"
    ).args;

    expect(eventArgs.account).to.equal(addr1.address);
    expect(eventArgs.token).to.equal(hardhatKrtToken.address);
    expect(eventArgs.amount.toString()).to.equal(tokens("200").toString());
    expect(eventArgs.rate.toString()).to.equal("100");
  });

  it("should be able to receive tokens from buyers", async function () {
    // Buy some tokens
    await hardhatKrtExchange.connect(addr1).buyTokens({
      value: ethers.utils.parseEther("2.0"),
    });

    let addr1Balance = await hardhatKrtToken.balanceOf(addr1.address);

    // Then sell half of those tokens
    await hardhatKrtToken
      .connect(addr1)
      .approve(hardhatKrtExchange.address, tokens("200"));

    const result = await hardhatKrtExchange
      .connect(addr1)
      .sellTokens(tokens("100"));

    addr1Balance = await hardhatKrtToken.balanceOf(addr1.address);

    expect(addr1Balance.toString()).to.equal(tokens("100").toString());

    const res = await result.wait();
    const eventArgs = res.events.find((e) => e.event == "KrtTokensSold").args;

    expect(eventArgs.account).to.equal(addr1.address);
    expect(eventArgs.token).to.equal(hardhatKrtToken.address);
    expect(eventArgs.amount.toString()).to.equal(tokens("100").toString());
    expect(eventArgs.rate.toString()).to.equal("100");
  });
});
