import { Address, toNano } from '@ton/core';
import { SendTransactionRequest, TonConnectButton, useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { airdropAddress, codeHex, dictBase64, entries } from './shared/constants/constants';
import { generateLimitOrderPayload } from './shared/helpers/helpers';

export default function App() {
  const [tonConnectUi] = useTonConnectUI();
  const myAddress = useTonAddress();
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

  const isAddressInEntries = myAddress ? entries.some((entry) => entry.address === myAddress) : false;
  const buttonColor = !myAddress ? 'bg-gray-500' : isAddressInEntries ? 'bg-green-500' : 'bg-red-500';

  return (
    <main className='flex h-screen w-full items-center justify-center'>
      <div className='flex h-[300px] w-[300px] flex-col items-center justify-center gap-5 rounded-lg bg-gray-700'>
        <TonConnectButton />
        <p className='text-center text-sm'>Get airdrop by connecting your wallet</p>
        <button className={`rounded-md p-2 text-white ${buttonColor}`} onClick={claim}>
          {isAddressInEntries ? `Claimed ${entries.find((entry) => entry.address === myAddress)?.amount} Jettons` : 'You not claimed'}
        </button>
      </div>
    </main>
  );
}
