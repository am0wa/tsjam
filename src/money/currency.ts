/**
 * ALL ISO Currency Codes.
 * @see https://www.iban.com/currency-codes
 */
export const CurrencyCodes = <const>[
  'AFN','ALL','DZD','USD','EUR','AOA','ARS','AMD','AWG','AUD','AZN','BSD','BHD','BDT',
  'BBD','BYN','BZD','BMD','BTN','INR','BOB','BOV','BAM','BWP','NOK','BRL','BND','BGN',
  'BIF','CVE','KHR','CAD','KYD','CLF','CLP','CNY','COP','COU','KMF','CDF','CRC','HRK',
  'CUC','CUP','ANG','CZK','DKK','DJF','DOP','EGP','SVC','ERN','ETB','FKP','FJD','XAF',
  'GMD','GEL','GHS','GIP','GTQ','GNF','GYD','HTG','HNL','HKD','HUF','ISK','IDR','XDR',
  'IRR','IQD','ILS','JMD','JPY','JOD','KZT','KES','KPW','KRW','KWD','KGS','LAK','LBP',
  'LSL','LRD','LYD','MOP','MGA','MWK','MYR','MVR','MRU','XUA','MXN','MXV','MDL','MNT',
  'MZN','MMK','NAD','NPR','NIO','NGN','OMR','PKR','PAB','PGK','PYG','PEN','PHP','PLN',
  'QAR','MKD','RON','RUB','RWF','WST','STN','SAR','RSD','SCR','SLL','SGD','XSU','SBD',
  'SOS','ZAR','SSP','LKR','SDG','SRD','SZL','SEK','CHE','CHF','CHW','SYP','TWD','TJS',
  'TZS','THB','XOF','NZD','TOP','TTD','TND','TRY','TMT','UGX','UAH','AED','GBP','USN',
  'UYI','UYU','UZS','VUV','VEF','VND','XPF','MAD','YER','ZMW','ZWL'
]

export type CurrencyCode = typeof CurrencyCodes[number];

export const isCurrencyCode = (isoCode: string): isoCode is CurrencyCode => {
  return !!CurrencyCodes.find((code) => code === isoCode);
}
