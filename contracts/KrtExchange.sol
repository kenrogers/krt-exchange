pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "./KrtToken.sol";

contract KrtExchange {
    // Name and krtToken are state variables, data is stored on blockchain
    string public name = "KrtExchange Instant Exchange";
    uint256 rate = 100; // Amount of tokens per 1 ether

    event KrtTokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    event KrtTokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 rate
    );

    // Creates variable that represents token smart contract
    // Allows us to call functions on this token like transfer
    // This is just the code, KrtExchange still doesn't know where to find it
    KrtToken public krtToken;

    // Tell KrtExchange contract where the KrtToken contract is located by getting its address
    // Here we are declaring the constructor function and telling it to expect a parameter when it is instantiated
    // In our test file, and later in our deployment file, we'll pass the KrtToken contract address
    constructor(KrtToken _krtToken) {
        krtToken = _krtToken;
    }

    function getName() external view returns (string memory) {
        console.log("Contract name:", name);
        return name;
    }

    function buyTokens() public payable {
        uint256 tokenAmount = msg.value * rate;

        // Make sure KrtExchange has enough tokens to transfer to user
        require(
            krtToken.balanceOf(address(this)) >= tokenAmount,
            "Not enough tokens in exchange"
        );

        krtToken.transfer(msg.sender, tokenAmount);

        // Emit an event
        emit KrtTokensPurchased(
            msg.sender,
            address(krtToken),
            tokenAmount,
            rate
        );
    }

    function sellTokens(uint256 _amount) public payable {
        // Calculate amount of ether to redeem
        uint256 etherAmount = _amount / rate;

        // Check that KrtExchange has enough ether
        require(address(this).balance >= etherAmount, "Not enough ether");

        // Here we are calling transfer for ether
        // This is different than the transfer function called on the token contract above
        payable(msg.sender).transfer(etherAmount);

        // Now we transfer the tokens from the seller to the exchange
        krtToken.transferFrom(msg.sender, address(this), _amount);

        emit KrtTokensSold(msg.sender, address(krtToken), _amount, rate);
    }
}
