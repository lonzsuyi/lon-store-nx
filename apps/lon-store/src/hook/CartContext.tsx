'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_CART,
  GET_CARTS,
  UPDATE_CART,
  PARTIAL_UPDATE_CART,
  DELETE_CART,
} from '../graphql/gql/cart';

/**
 * Defines the GraphQL input structure for updating cart items.
 */
type CartItemInput = {
  productId: number;
  quantity: number;
};

/**
 * Defines a cart item structure, including product ID and full product details.
 */
type CartItem = {
  productId: number;
  quantity: number;
  product: {
    id: number;
    title: string;
    price: number;
    category: string;
    description: string;
    image: string;
    rating: {
      rate: number;
      count: number;
    };
  };
};

/**
 * Defines the shopping cart structure.
 */
type Cart = {
  id: number;
  userId: number;
  date: string;
  products: CartItem[];
};

/**
 * Defines the Cart Context structure.
 */
type CartContextType = {
  cart: Cart | null;
  carts: Cart[] | null;
  updateCart: (cart: Cart) => void;
  partialUpdateCart: (
    cartId: number,
    products: CartItemInput[]
  ) => void;
  deleteCart: (id: number) => void;
  refetchCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
};

// Create Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * CartProvider component that manages cart state and synchronization with GraphQL API.
 */
export const CartProvider = ({
  children,
  userId,
}: {
  children: ReactNode;
  userId: number;
}) => {
  // Shopping cart open/close state
  const [isCartOpen, setCartOpen] = useState(false);

  // Fetch cart data for the given user ID
  const { data: cartData, refetch: refetchCart } = useQuery(GET_CART, {
    variables: { id: userId }, // Fetch cart by user ID
    skip: !userId, // Prevent query if no userId is provided
  });

  // Fetch all carts
  const { data: cartsData, refetch: refetchCarts } = useQuery(GET_CARTS, {
    skip: !userId, // Only fetch if userId exists
  });

  // Mutation to update the entire cart (PUT)
  const [updateCartMutation] = useMutation(UPDATE_CART, {
    onCompleted: () => {
      refetchCart();
      refetchCarts();
    },
  });

  // Mutation to partially update the cart (PATCH)
  const [partialUpdateCartMutation] = useMutation(PARTIAL_UPDATE_CART, {
    onCompleted: () => {
      refetchCart();
      refetchCarts();
    },
  });

  // Mutation to delete a cart
  const [deleteCartMutation] = useMutation(DELETE_CART, {
    onCompleted: () => {
      refetchCart();
      refetchCarts();
    },
  });

  return (
    <CartContext.Provider
      value={{
        cart: cartData?.cart || null,
        carts: cartsData?.carts || null,
        updateCart: (cart) =>
          updateCartMutation({
            variables: {
              id: cart.id,
              userId: cart.userId,
              date: cart.date,
              products: cart.products.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })), //Convert to GraphQL format
            },
          }),
        partialUpdateCart: (cartId, products) =>
          partialUpdateCartMutation({
            variables: {
              id: cartId,
              userId: userId,
              products,
            },
          }),
        deleteCart: (id) => deleteCartMutation({ variables: { id } }),
        refetchCart,
        isCartOpen,
        openCart: () => setCartOpen(true),
        closeCart: () => setCartOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

/**
 * Custom hook to use cart context.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
