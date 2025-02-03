import ApolloClientProvider from '../graphql/ApolloProvider';
import { CartProvider } from '../hook/CartContext';

import 'tailwindcss/tailwind.css';
import './global.css';

export const metadata = {
  title: 'Welcome to lon-store',
  description: 'lon-store',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Example user ID (replace this with actual authentication logic)
  const userId = 1; // You can fetch this dynamically

  return (
    <html lang="en">
      <body>
        <ApolloClientProvider>
          <CartProvider userId={userId}>{children}</CartProvider>
        </ApolloClientProvider>
      </body>
    </html>
  );
}
