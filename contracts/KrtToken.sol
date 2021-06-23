pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract KrtToken is ERC20 {
    constructor() ERC20("Ken Rogers Token", "KRT") {
        _mint(msg.sender, 1000000000000000000000000); // 1 million tokens with 18 decimal places, see https://docs.openzeppelin.com/contracts/4.x/erc20#a-note-on-decimals
    }
}
