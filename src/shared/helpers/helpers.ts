import { Address, beginCell, Builder, Cell, contractAddress, Dictionary, Slice } from '@ton/ton';
import { Buffer } from 'buffer';

export type AirdropHelper = {
  address: Address;
  stateInitBase64: string;
  msgBody: string;
};

export type AirdropEntry = {
  address: Address;
  amount: bigint;
};

export const airdropEntryValue = {
  serialize: (src: AirdropEntry, buidler: Builder) => {
    buidler.storeAddress(src.address).storeCoins(src.amount);
  },
  parse: (src: Slice) => {
    return {
      address: src.loadAddress(),
      amount: src.loadCoins(),
    };
  },
};

export function generateLimitOrderPayload(args: { airdropAddress: Address; indexFutureOwner: bigint; dictHash: string; code: string }) {
  const dictCell = Cell.fromBase64(args.dictHash);
  const dict = dictCell.beginParse().loadDictDirect(Dictionary.Keys.BigUint(256), airdropEntryValue);

  // console.log('Available keys in dictionary:', Array.from(dict.keys()));

  const proof = dict.generateMerkleProof([args.indexFutureOwner]);

  const contractData = beginCell()
    .storeBit(false)
    .storeAddress(args.airdropAddress)
    .storeBuffer(proof.hash(), 32)
    .storeUint(args.indexFutureOwner, 256)
    .endCell();

  const codeCell = Cell.fromBoc(Buffer.from(args.code, 'hex'))[0];

  const stateInit = beginCell().storeUint(0, 2).storeUint(1, 1).storeUint(1, 1).storeUint(0, 1).storeRef(codeCell).storeRef(contractData).endCell();

  const address = contractAddress(0, {
    code: codeCell,
    data: contractData,
  });

  const stateInitBase64 = Buffer.from(stateInit.toBoc()).toString('base64');

  const msgBody: Cell = beginCell().storeUint(1, 32).storeUint(0, 64).storeRef(proof).endCell();

  return { address, stateInitBase64, msgBody };
}
