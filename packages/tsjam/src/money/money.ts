/**
 * The smallest Integer part of Fiat money like currencies.
 *
 * Reasons to avoid standard floating-point types:
 *    - Precision loss e.g. 0.1 + 0.2 !== 0.3 // true 0_o
 *    - Rounding errors e.g. 0.1 + 0.2 = 0.30000000000000004 // 0_o
 */
export type Cents = number;

/**
 * Monetary units value aka '100.00' (USD) or '0.000000009' (BTC)
 *
 * "Monetary unit principle" states that all transactions are recorded and measured in the relevant monetary unit e.g. EUR or USD
 */
export type MonetaryUnits = string;

/** Formated Money representing string aka '$ 100,000.00' */
export type MonetaryString = string;
