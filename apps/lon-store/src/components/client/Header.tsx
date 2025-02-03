'use client';

import { useCart } from '../../hook/cartContext';

import { Header as CustHeader } from '@lon-store-nx/lon-store-components';

export const Header: React.FC = () => {
  const { openCart, cart } = useCart();

  return (
    <>
      <CustHeader
        className="absolute z-40 [--header-h:_65px]"
        cartCount={cart?.products.length}
        onCartBtnClick={openCart}
      />
      <div className="h-[65px]"></div>
    </>
  );
};

export default Header;
