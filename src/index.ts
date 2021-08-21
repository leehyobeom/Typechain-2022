import * as CryptoJS from "crypto-js";

class Block {

    static calculateBlockHash = (
        index:number, 
        previousHash:string, 
        timestamp:number, 
        data:string
        ): string => CryptoJS.SHA256(index + previousHash + timestamp + data).toString();

    static validateStructure = (aBlock: Block): boolean => 
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.data === "string" &&
    typeof aBlock.timestamp === "number"

    public index:number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ){
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}
const genesisBlock:Block = new Block(0,"1000101011001010","","Hello",12345);

let blockchain:Block[] = [genesisBlock];

const getBlockchain = ():Block[] => blockchain;
const getLatesBlock = (): Block => getBlockchain()[blockchain.length - 1];
const getNewTimeStamp = (): number => Math.round(new Date().getTime() /1000);
const createNewBlock = (data:string): Block => {

    const previosBlock: Block = getLatesBlock();
    const newIndex : number  = previosBlock.index + 1;
    const nextTimestamp: number = getNewTimeStamp();
    const newHash : string = Block.calculateBlockHash(newIndex, previosBlock.hash, nextTimestamp, data);
    const newBlock: Block = new Block(newIndex, newHash, previosBlock.hash, data, nextTimestamp );
    // blockchain.push(newBlock);
    addBlcok(newBlock);
    return newBlock;
}

const getHashforBlock = (aBlock: Block) :string => Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);

const isBlockValid = (candidateBlock:Block, previousBlock: Block): boolean => {

    if(!Block.validateStructure(candidateBlock)){   
        return false;
    } else if(previousBlock.index + 1 !== candidateBlock.index) {
        return false;
    } else if (previousBlock.hash !== candidateBlock.previousHash ){
        return false;
    } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash){
        return false;
    } else {
        return true;   
    }
}

const addBlcok = (candidateBlock: Block) => {
    if(isBlockValid(candidateBlock, getLatesBlock())){
        blockchain.push(candidateBlock);
    }
}
createNewBlock("hello!");
createNewBlock("bye bye");
createNewBlock("3번째 블록");
console.log(blockchain);
export {};

