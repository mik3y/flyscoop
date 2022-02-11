/**
 * Collection of utility functions.
 */

import { getRandomBytes } from "expo-random";
import { binary_to_base58 as b58encode } from "base58-js";

/** Generates a random ID with given prefix. */
export const makeRandomId = (prefix, numBytes = 16) => {
  const bytes = getRandomBytes(numBytes);
  const encoded = b58encode(bytes);
  return `${prefix}_${encoded}`;
};
