import { Blockchain } from './services/blockchain.js';

const chainObj = new Blockchain();
console.log("Genesis Block:", chainObj.getLatestBlock());

chainObj.addBlock({ update: "Distributed to Warehouse A" });
console.log("\nSecond Block:", chainObj.getLatestBlock());

chainObj.addBlock({ update: "Arrived at Pharmacy B" });
console.log("\nThird Block:", chainObj.getLatestBlock());

console.log("\nIs chain valid?", chainObj.isChainValid());

// Tamper check
chainObj.chain[1].data = { update: "Fake Update" };
console.log("After tampering data, is chain valid?", chainObj.isChainValid());
