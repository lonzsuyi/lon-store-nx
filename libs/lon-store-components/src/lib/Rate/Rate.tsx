import React from 'react';
import dynamic from 'next/dynamic';
import type { RateProps } from './Rate.types';

const RateClient = dynamic(() => import('./Rate.client'));
const RateServer = dynamic(() => import('./Rate.server'));

/**
 * Wrapper component that automatically selects the correct version (server or client).
 */
export const Rate: React.FC<RateProps> = (props) => {
  return props.interactive ? <RateClient {...props} /> : <RateServer {...props} />;
};

export default Rate;