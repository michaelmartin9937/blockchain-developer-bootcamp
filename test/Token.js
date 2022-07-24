const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	//Tests go inside here

	// let token
	// let accounts
	// let deployer
	let token, accounts, deployer, receiver

	beforeEach(async () => {
		// Code goes here...
		// Fetch Token from Blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
	})

	describe('Deployment', () => {
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')
	
	describe('Sending Token', () => {
		let amount, transaction, result

		describe('Success', () => {

			beforeEach(async () => {
				amount = tokens(100)
				transaction = await token.connect(deployer).transfer(receiver.address, amount)
				result = await transaction.wait()
			})

			it('Transfers token balances', async () => {
				// Log balance before transfer
				console.log("deployer balance before transfer", await token.balanceOf(deployer.address))
				console.log("receiver balance before transfer", await token.balanceOf(receiver.address))

				// Transfer tokens
				expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
				expect(await token.balanceOf(receiver.address)).to.equal(amount)

				// Log balance after transfer
				console.log("deployer balance after transfer", await token.balanceOf(deployer.address))
				console.log("receiver balance after transfer", await token.balanceOf(receiver.address))

				// Ensure that tokens were transfered (balance changed)
			})

			it('Emits a Transfer event', async () => {
				const event = result.events[0]
				// console.log(event)
				expect(event.event).to.equal('Transfer')
				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})


		})

		describe('Failure', () => {
			it('rejects insufficient balances', async () => {
				// Transfer more tokens than deployer has - 100M
				const invalidAmount = tokens(100000000)
				await expect(token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})

			it('rejects invalid recipient', async () => {
				const amount = tokens(100)
				await expect(token.connect(deployer).transfer('0x000000000000000000000', amount)).to.be.reverted
			})
		})

		

	})

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

	it('assigns total supply to deployer', async () => {
		expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
	})

	})
})
