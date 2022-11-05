//to create a test script to check the name of the smart contract
// is true
const { expect } = require('chai');
const { ethers } = require('Hardhat');

const tokens = (n)=> {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', ()=> {
	
	let token, account, deployer, receiver, exchange

	beforeEach(async() => {
		const Token = await ethers.getContractFactory('Token')
		// read the smart contract
		token = await Token.deploy('Bharat', 'BRT', '1000000')
		account = await ethers.getSigners()
		deployer = account[0]
		receiver = account[1]
		exchange = account[2]
	})

	describe('Deployment', ()=>{
		const name = 'Bharat'
		const symbol = 'BRT'
		const totalSupply = tokens(1000000)

		it("check correct name", async () => {
		expect(await token.name()).to.equal(name)
	
	})

	it("check correct symbol", async () => {
		expect(await token.symbol()).to.equal(symbol)
	
	})

	it("check correct decimal", async () => {
		expect(await token.decimals()).to.equal('18')

	})

	it("check correct total supply", async () => {
		expect(await token.totalSupply()).to.equal(totalSupply)
	
	})

	it("mapping account 1 to total supply", async () => {
		expect(await token.balanceOf(deployer.address)).to.equal(totalSupply)
	
	})


	})

	describe("Sending Tokens", ()=> {
		let amount, transaction, result
		describe("Success of transfer event", ()=> {
		

		beforeEach(async ()=> {
			amount = tokens(100)
			transaction = await token.connect(deployer).transfer(receiver.address, amount)
			result = await transaction.wait()
		})
		it("Sending tokens to other account", async ()=> {

			expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
			expect(await token.balanceOf(receiver.address)).to.equal(amount)
		})
		
		it("Event Tranfer testing", async()=> {
			const event = result.events[0]
			expect(await event.event).to.equal('Transfer') 
			const arg = event.args 
			expect(await arg.from).to.equal(deployer.address)
			expect(await arg.to).to.equal(receiver.address)
			expect(await arg.value).to.equal(amount)
			
		})
	})
		describe("Failure of event transfer", ()=>{

			it("Rejects insufficient funds", async ()=>{

				const invalidAmount = tokens(100000000)
				await expect( token.connect(deployer).transfer(receiver.address, invalidAmount)).to.be.reverted
			})
		})


		})

		describe("Approve Tokens", ()=> {
			let amount, transaction, result
			beforeEach(async ()=> {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
		})
			describe("Success", ()=> {

				it("Checking to see allowance is approved", async ()=>{
				expect(await token.allowance(deployer.address, exchange.address)).to.equal(amount)

			})
			it("Event Approval testing", async()=> {
			const event = result.events[0]
			expect(await event.event).to.equal('Approval') 
			const arg = event.args 
			expect(await arg.owner).to.equal(deployer.address)
			expect(await arg.spender).to.equal(exchange.address)
			expect(await arg.value).to.equal(amount)
			
		})
			})
			describe("Failure", ()=> {

				it("Rejects invalid spenders", async ()=> {
				await expect( token.connect(deployer).approve('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
				})
			})
			
		})
		
		describe('Delegate tokens', ()=>{
			//approve tokens vital step before transferFrom, approving tokens before sending them
			let amount, transaction, result
			beforeEach(async ()=> {
			amount = tokens(100)
			transaction = await token.connect(deployer).approve(exchange.address, amount)
			result = await transaction.wait()
			})

			describe('Success', ()=> {
				//we call transferFrom here after the prerequisite step of approve
				//3 parties involved, deployer approves the exchange, exchange transfers the tokens from deployer account to receiver's
				//swap goes directly out of the deployer's wallet to the receiver
			beforeEach(async ()=> {
			transaction = await token.connect(exchange).transferFrom(deployer.address, receiver.address, amount)
			result = await transaction.wait()
			})

			it('transfers tokens', async()=> {
			expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
			expect(await token.balanceOf(receiver.address)).to.equal(amount)
			})

			it("Transfer Event approaval", async()=>{
			const event = result.events[0]
			expect(await event.event).to.equal('Transfer') 
			const arg = event.args 
			expect(await arg.from).to.equal(deployer.address)
			expect(await arg.to).to.equal(receiver.address)
			expect(await arg.value).to.equal(amount)
			})

			})

			describe('Failure', ()=> {
			//attempt to transfer invalid amount
			
			it('Rejects insufficient amounts', async () => {
			const invalidAmount = tokens(100000000)
			await expect(token.connect(exchange).transferFrom(deployer.address, receiver.address, invalidAmount)).to.be.reverted
	
})	
			})
		
	})
})