'use client';

import { PayPalScriptProvider } from '@paypal/react-paypal-js';

const initialOptions = {
  clientId: 'AVjtgYJvqKRp8dXgag6NHi_5PNm3RkbUBS27r2ZEQMhbZ0oxWggSmmHN00FyYW09P13fFlfFd-jR49T4',
  currency: 'USD',
  intent: 'capture',
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PayPalScriptProvider options={initialOptions}>
      {children}
    </PayPalScriptProvider>
  );
} 