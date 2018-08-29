// SHA-256 is a hash generator designed by NSA
// importing SHA-256
const SHA256 = require('crypto-js/sha256');

// making it friendly to multiple transactions and defining what propreties transactions have
class Transactions{
	// a transaction always goes from someone, to someone and it carries an amount of traded assets
	constructor(fromAddress, toAddress, amount){
		this.fromAddress = fromAddress;
		this.toAddress = toAddress;
		this.amount = amount;
	}
}

class Block {
	constructor(
		// When was the block created
		timestamp,
		// content of the block (details of a transaction or terms of a contract)
		transactions,
		//gets the hash of the block that came before this one
		previousHash = ''
	)
	{
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.transactions = transactions;
		this.hash = this.calculateHash();
		// so that the hash of the block changes and isn't limited to changing only when one of the previous variables change.
		// number that isn't connected to the chain but can be changed whenever the while loop is runing
		this.nonce = 0;
	}
	// calculates the hash function of the current block by taking the propreties of the block fore stored and running through it
	calculateHash() {
		// taking the transaction and creating a hash id that is a string
		return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
	}
	// proof of work, a way of proving that you've added an amount of computing power to making a new block. aka 'mining'. Add in a level of difficulty for creating new blocks, calculating that a block should take a certain amount of time to be created and setting out a "reward" when it's ready, as more blocks are created and more computational power's added and the complexity of generating new blocks increases.
	// add a mining method
	mineBlock(difficulty) {
		// looping until a hash starts with enough zeros and it'll keep runing until not all of the hash equal to zeros. Creating a string of zeroes with the same length as difficulty
		while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
			// incrementing this number as long as the hash doens't have enough zeroes to end the block's creation
			this.nonce++;
			this.hash = this.calculateHash();
		}
		// when the while loop's done the block's mined, so display this message
		console.log("Block mined: "+this.hash);
	}
}
// creating methods
// adding the blocks created to a chain
class Blockchain {
	constructor() {
		// this is the array of blocks in the chain
		this.chain = [this.createGenesisBlock()];
		// setting up the level of dificulty. How fast can a block be added to the blockchain?
		this.difficulty = 4;
	}
	// first block in a chain is always the genesis block and has no previousHash value assigned to it
	// creating the genesis block
	createGenesisBlock() {
		return new Block(
			// timestamp
			"08/08/2018",
			// transactions
			"Genesis block",
			// previousHash
			"0"
		);
	}
	// adding the last blocks generated into the chain
	getLatestBlock() {
		// returns the last block ALREADY CREATED in the chain
		return this.chain[this.chain.length - 1];
	}
	// adds a new block to the chain
	addBlock(newBlock) {
		// setting the previous hash property of the new block to get the latest block's hash information, get the block and then the hash
		newBlock.previousHash = this.getLatestBlock().hash;

		// making it so that everytime an element at the constructor function changes a new block is created
		// newBlock.hash = newBlock.calculateHash();

		// pass in a difficulty for the processing of the new block
		newBlock.mineBlock(this.difficulty);
		// writing the new block into the chain
		this.chain.push(newBlock);
	}
	// checking the chains validation, verifying the integrity of the chain, blocks in the blockchain can never be changed or deleted.
	isChainValid(){
		// return true if the chain is valid and false if not. Starts by with i = 1 since the block 0 is the genesis block and doesn't have a transaction to check for validation.
		for (let i = 1; i < this.chain.length; i++){
			// taking the current block
			const currentBlock = this.chain[i];
			// taking the previous block for comparison, so i-1
			const previousBlock = this.chain[i - 1];
			// check if the hash of the current block is still vailed
			if(currentBlock.hash !== currentBlock.calculateHash()){
				return false;
			}
			// check if the block is pointing to the previous block by analysing the previous dash
			if(currentBlock.previousHash !== previousBlock.hash){
				return false;
			}
		}
		// if it gets to this point then the chain is vailed
		return true;
	}
}

// testing instance for this blockchain
// creating a new blockchain
let suhCoin = new Blockchain();

// inform that the block's mining
console.log('Mining block 1...');
// creating a new block
suhCoin.addBlock(new Block(
	// timestamp
	"10/08/2018",
	// transactions
	{ amount: 4 }
	//previousHash is auto added
	));

// inform that the block's mining
console.log('Mining block 2...');
suhCoin.addBlock(new Block(
	// timestamp
	"11/08/2018",
	// transactions
	{ amount: 2 }
	//previousHash is auto added
	));


// making it display if the blockchain is valid or not without trying to make any changes to the chain
// console.log('Is this blockchain valid? ', suhCoin.isChainValid());
// changing propreties to check for validation
// suhCoin.chain[1].transactions = { amount: 20 };
// recalculating dash to check for validation
// suhCoin.chain[1].hash = suhCoin.chain[1].calculateHash();
// making it display if the blockchain is valid or not while trying to make changes to the chain (date and hash)
// console.log('Is this blockchain valid? '+suhCoin.isChainValid());
// making it display the blockchain info on the page, stringify it so it's readble on the screen
// console.log(JSON.stringify(suhCoin, null, 4));
