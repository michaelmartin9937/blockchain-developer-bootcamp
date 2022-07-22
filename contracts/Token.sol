// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";

// contract Token {
// 	string public name = "Dapp University";
// 	string public symbol = "DAPP";
// 	// Decimals
// 	uint256 public decimals = 18;
// 	// Total Supply
// 	// uint256 public totalSupply = 1000000 * (10**decimals);
// 	uint256 public totalSupply = 1000000000000000000000000;
// }

contract Token {
	string public name;
	string public symbol;
	// Decimals
	uint256 public decimals = 18;
	// Total Supply
	// uint256 public totalSupply = 1000000 * (10**decimals);
	// uint256 public totalSupply = 1000000000000000000000000;
	uint256 public totalSupply;


	constructor(string memory _name, string memory _symbol, uint256 _totalSupply) {
		name = _name;
		symbol = _symbol;
		totalSupply = _totalSupply * (10**decimals);
	}
}
