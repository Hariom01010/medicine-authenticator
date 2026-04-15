import crypto from 'crypto';

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    // We use ISO string for consistent timestamp formats
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    // SHA256(index + timestamp + JSON.stringify(data) + previousHash)
    const str = this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash;
    return crypto.createHash('sha256').update(str).digest('hex');
  }
}

class Blockchain {
  // Allow initializing from an existing DB array, or start fresh
  constructor(existingChain = null) {
    if (existingChain && existingChain.length > 0) {
      // Rehydrate Block instances so they have the .calculateHash() method
      this.chain = existingChain.map(b => {
        const block = new Block(b.index, b.timestamp, b.data, b.previousHash);
        // Important: override the dynamically calculated hash with the exact one saved in DB
        block.hash = b.hash; 
        return block;
      });
    } else {
      // Start a brand new chain
      this.chain = [this.createGenesisBlock()];
    }
  }

  createGenesisBlock() {
    return new Block(0, new Date().toISOString(), { info: "Batch Genesis - Medicine Created" }, "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(data) {
    const previousBlock = this.getLatestBlock();
    const newIndex = previousBlock.index + 1;
    const newTimestamp = new Date().toISOString();
    
    // Create new block linked to the latest hash
    const newBlock = new Block(newIndex, newTimestamp, data, previousBlock.hash);
    
    this.chain.push(newBlock);
    return newBlock;
  }

  isChainValid() {
    // 0. Explicitly verify the Genesis block for tampering!
    // (Standard loops start at 1 to check links, but we must verify index 0 data remains pure)
    if (this.chain.length > 0) {
        const genesisBlock = this.chain[0];
        if (genesisBlock.hash !== genesisBlock.calculateHash()) return false;
    }

    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // 1. Has the data in the current block been tampered with?
      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      // 2. Is it properly linked to the previous block?
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true; // Chain is structurally sound
  }
}

export { Block, Blockchain };
