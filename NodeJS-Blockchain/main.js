// SHA-256 is a hash generator designed by NSA
// importing SHA-256
const SHA256 = require('crypto-js/sha256');

class Block {
	constructor(
		// Where the block is on the chain
		index,
		// When was the block created
		timestamp,
		// content of the block (details of a transaction or terms of a contract)
		data,
		//gets the hash of the block that came before this one
		previousHash = ''
	)
	{
		this.index = index;
		this.previousHash = previousHash;
		this.timestamp = timestamp;
		this.data = data;
		this.hash = this.calculateHash();
	}
	// calculates the hash function of the current block by taking the propreties of the block fore stored and running through it
	calculateHash() {
		//taking the data and creating a hash id that is a string
		return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
	}
}

// adding the blocks created to a chain
class Blockchain {
	constructor() {
		// this is the array of blocks in the chain
		this.chain = [this.createGenesisBlock()];
	}
	// first block in a chain is always the genesis block and has no previousHash value assigned to it
	// creating the genesis block
	createGenesisBlock() {
		return new Block(
			// index
			0,
			// timestamp
			"08/08/2018",
			// data
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
		newBlock.hash = newBlock.calculateHash();
		// writing the new block into the chain
		this.chain.push(newBlock);
	}
}

// testing instance for this blockchain
// creating a new blockchain
let suhCoin = new Blockchain();
// creating a new block
suhCoin.addBlock(new Block(
	// index
	1,
	// timestamp
	"10/08/2018",
	// data
	{ amount: 4 }
	//previousHash is auto added
	));
suhCoin.addBlock(new Block(
	// index
	2,
	// timestamp
	"11/08/2018",
	// data
	{ amount: 2 }
	//previousHash is auto added
	));
// making it display the blockchain info on the page, stringify it so it's readble on the screen
console.log(JSON.stringify(suhCoin, null, 4));