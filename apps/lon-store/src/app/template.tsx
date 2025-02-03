import React from 'react';

import { Header, CartDialog } from '../components/client';
import { Footer } from '@lon-store-nx/lon-store-components';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <React.Suspense>
        <Header />
      </React.Suspense>
      <main
        style={{
          height: 'calc(100vh - 65px)',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {children}
        <React.Suspense>
          <CartDialog />
        </React.Suspense>
        <Footer />
      </main>
    </>
  );
}
