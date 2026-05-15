'use client';

import { DialRoot } from 'dialkit';
import 'dialkit/styles.css';

/** Dev-time DialKit panel (hidden in production by default). Mount once in the app shell. */
export function DialKitRoot() {
  return <DialRoot />;
}
