import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TonProvider = ({ children }: { children: React.ReactNode }) => {
  return <TonConnectUIProvider manifestUrl={'https://taiga-labs.github.io/gorelko.json'}>{children}</TonConnectUIProvider>;
};
