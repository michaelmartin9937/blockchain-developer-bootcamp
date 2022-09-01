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
	let token, accounts, deployer, receiver, exchange

	beforeEach(async () => {
		// Code goes here...
		// Fetch Token from Blockchain
		const Token = await ethers.getContractFactory('Token')
		token = await Token.deploy('Dapp University', 'DAPP', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		receiver = accounts[1]
		exchange = accounts[2]
	})

	describe('Deployment', () => {
		const name = 'Dapp University'
		const symbol = 'DAPP'
		const decimals = '18'
		const totalSupply = tokens('1000000')

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
	
	describe('Sending Tokens', () => {
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
				expect(event.event).to.equal('Transfer')
				// console.log(event)
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
				await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})

		
	})

	describe('Approving Tokens', () => {
		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			it('allocates an allowance for delegated token spending', async () => {
				expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)
			})
		})

			it('Emits an Approval event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Approval')
				// console.log(event)
				const args = event.args
				expect(args.owner).to.equal(deployer.address)
				expect(args.spender).to.equal(exchange.address)
				expect(args.value).to.equal(amount)
			})

		describe('Failure', () => {
			it('rejects invalid spenders', async () => {
				await expect(token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
			})
		})

	})

	describe('Delegated Token Transfers', () => {
		let amount, transaction, result

		beforeEach(async () => {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})

		describe('Success', () => {
			beforeEach(async () => {
				transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
				result = await transaction.wait()
			})

			it('Transfers token balances', async () => {
				expect(await token.balanceOf(deployer.address)).to.be.equal(ethers.utils.parseUnits('999900', 'ether'))
				expect(await token.balanceOf(receiver.address)).to.be.equal(amount)
			})

			it('resets the allowance', async () => {
				expect(await token.allowance(deployer.address, exchange.address)).to.be.equal(0)
			})

			it('Emits a Transfer event', async () => {
				const event = result.events[0]
				expect(event.event).to.equal('Transfer')
				// console.log(event)
				const args = event.args
				expect(args.from).to.equal(deployer.address)
				expect(args.to).to.equal(receiver.address)
				expect(args.value).to.equal(amount)
			})
		})

		describe('Failure', async () => {
			// attempt to transfer too many tokens
			const invalidAmount = tokens(1000000) // 100 Million, greater than total supply
			await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
		})


	})

})

