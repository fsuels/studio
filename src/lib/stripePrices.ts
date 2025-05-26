/** central Stripe SKU ↔︎ Price ID map
 *  add / edit values here only – the checkout route will pick them up
 */
export const PRICE_LOOKUP: Record<string, string> = {
  /* — individual documents — */
  'bill-of-sale': 'price_1PABCDabcd1234',
  'residential-lease': 'price_1PABCDEfgh5678',
  /* — bundles — */
  'landlord-starter': 'price_1PXYZxyz9876',
  // 🔹 add more SKUs as you publish them in Stripe
};

/** optional promo‑code → Coupon ID map  */
export const COUPONS: Record<string, string> = {
  SUMMER10: 'coupon_summer10', // 10 % off
  BUNDLE20: 'coupon_bundle20', // 20 % off
};
