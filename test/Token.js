const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	//Tests go inside here

	let token

	beforeEach(async () => {
		// Code goes here...
		// Fetch Token from Blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')
	})

	describe('Deployment', () => {
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')
	

	// Describe spending

	it('has correct name', async () => {
		// Read token name
		// Check that name is correct
		expect(await token.name()).to.equal(name)
	})

	it('has correct symbol', async () => {
		// Read token name
		// Check that name is correct
		expect(await token.symbol()).to.equal(symbol)
	})

	it('has correct decimals', async () => {
		expect(await token.decimals()).to.equal(decimals)
	})

	it('has correct total supply', async () => {
		// const value = ethers.utils.parseUnits('1000000', 'ether')
		// const value = tokens('1000000')
		expect(await token.totalSupply()).to.equal(totalSupply)
	})

	})
})
