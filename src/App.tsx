import { Address, toNano } from '@ton/core';
import { SendTransactionRequest, TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { airdropAddress, codeHex, dictBase64 } from './shared/constants/constants';
import { generateLimitOrderPayload } from './shared/helpers/helpers';

export default function App() {
  const [tonConnectUi] = useTonConnectUI();
  const { address, stateInitBase64, msgBody } = generateLimitOrderPayload({
    airdropAddress: Address.parse(airdropAddress),
    indexFutureOwner: 5n,
    dictHash: dictBase64,
    code: codeHex,
  });

  const claim = () => {
    const message: SendTransactionRequest = {
      validUntil: Math.floor(Date.now() / 1000) + 60,
      messages: [
        {
          address: address.toString(),
          amount: toNano(0.15).toString(),
          stateInit: stateInitBase64,
          payload: msgBody.toBoc().toString('base64'),
        },
      ],
    };

    tonConnectUi.sendTransaction(message);
  };

  return (
    <main className='flex h-screen w-full items-center justify-center'>
      <div className='flex h-[300px] w-[300px] flex-col items-center justify-center gap-5 rounded-lg bg-gray-700'>
        <TonConnectButton />
        <p className='text-center text-sm'>Get airdrop by connecting your wallet</p>
        <button className='rounded-md bg-blue-500 p-2 text-white' onClick={claim}>
          Get airdrop
        </button>
      </div>
    </main>
  );
}
