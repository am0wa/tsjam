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
  'MZN','MMK','MUR','NAD','NPR','NIO','NGN','OMR','PKR','PAB','PGK','PYG','PEN','PHP',
  'PLN','QAR','MKD','RON','RUB','RWF','WST','STN','SAR','RSD','SCR','SLL','SGD','XSU',
  'SBD','SOS','ZAR','SSP','LKR','SDG','SRD','SZL','SEK','CHE','CHF','CHW','SYP','TWD',
  'TJS','TZS','THB','XOF','NZD','TOP','TTD','TND','TRY','TMT','UGX','UAH','AED','GBP',
  'USN','UYI','UYU','UZS','VUV','VEF','VND','XCD','XPF','MAD','YER','ZMW','ZWL'
]

export type CurrencyCode = typeof CurrencyCodes[number];

export const isCurrencyCode = (isoCode: string): isoCode is CurrencyCode => {
  return !!CurrencyCodes.find((code) => code === isoCode);
}

export type Currency = {
  readonly code: CurrencyCode;
  readonly symbol: string;
  readonly name?: string;
};

export const worldCurrencies: readonly Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  // ---- secondary: (alphabetical order) ----
  { code: 'ALL', symbol: 'Lek', name: 'Lek' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'AFN', symbol: '؋', name: 'Afghani' },
  { code: 'ANG', symbol: 'f', name: 'Netherlands Antillean Guilder' },
  { code: 'AMD', symbol: '֏', name: 'Armenian Dram' },
  { code: 'AOA', symbol: 'Kz', name: 'Kwanza' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'AWG', symbol: 'ƒ', name: 'Aruban Florin' },
  { code: 'AZN', symbol: '₼', name: 'Azerbaijanian Manat' },
  { code: 'BOB', symbol: 'Bs', name: 'Boliviano' },
  { code: 'BAM', symbol: 'KM', name: 'Convertible Mark' },
  { code: 'BBD', symbol: '$', name: 'Barbados Dollar' },
  { code: 'BDT', symbol: '৳', name: 'Taka' },
  { code: 'BGN', symbol: 'Лв.', name: 'Bulgarian Lev' },
  { code: 'BMD', symbol: '$', name: 'Bermudian Dollar' },
  { code: 'BOB', symbol: '$b', name: 'Boliviano' },
  { code: 'BND', symbol: '$', name: 'Brunei Dollar' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'BSD', symbol: 'B$', name: 'Bahamian Dollar' },
  { code: 'BTN', symbol: 'Nu.', name: 'Ngultrum' },
  { code: 'BWP', symbol: 'P', name: 'Pula' },
  { code: 'BYN', symbol: 'Br', name: 'Belarussian Ruble' },
  { code: 'BZD', symbol: '$', name: 'Belize Dollar' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
  { code: 'CDF', symbol: 'FC', name: 'Congolese Franc' },
  { code: 'CHF', symbol: 'F', name: 'Swiss Franc' },
  { code: 'CNY', symbol: '¥', name: 'Yuan Renminbi' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'CNY', symbol: '¥', name: 'Yuan Renminbi' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colon' },
  { code: 'CUC', symbol: 'CUC$', name: 'Peso Convertible' },
  { code: 'CUP', symbol: '$MN', name: 'Cuban Peso' },
  { code: 'CVE', symbol: '$', name: 'Cabo Verde Escudo' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'DKK', symbol: 'Kr', name: 'Danish Krone' },
  { code: 'DOP', symbol: '$', name: 'Dominican Peso' },
  { code: 'DZD', symbol: 'دج', name: 'Algerian Dinar' },
  { code: 'ERN', symbol: 'Nfk', name: 'Nakfa' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'ETB', symbol: 'Br', name: 'Ethiopian Birr' },
  { code: 'FJD', symbol: 'FJ$', name: 'Fiji Dollar' },
  { code: 'FKP', symbol: '£', name: 'Falkland Islands Pound' },
  { code: 'GEL', symbol: '₾', name: 'Lari' },
  { code: 'GHS', symbol: 'GH¢', name: 'Ghana Cedi' },
  { code: 'GIP', symbol: '£', name: 'Gibraltar Pound' },
  { code: 'GMD', symbol: 'D', name: 'Dalasi' },
  { code: 'GTQ', symbol: 'Q', name: 'Quetzal' },
  { code: 'GYD', symbol: 'G$', name: 'Guyana Dollar' },
  { code: 'HNL', symbol: 'L', name: 'Lempira' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar' },
  { code: 'HRK', symbol: 'kn', name: 'Kuna' },
  { code: 'HUF', symbol: 'Ft', name: 'Forint' },
  { code: 'HTG', symbol: 'G', name: 'Gourde' },
  { code: 'IDR', symbol: 'Rp', name: 'Rupiah' },
  { code: 'ILS', symbol: '₪', name: 'New Israeli Sheqel' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'ISK', symbol: 'kr', name: 'Iceland Krona' },
  { code: 'IRR', symbol: '﷼', name: 'Iranian Rial' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'JMD', symbol: '$', name: 'Jamaican Dollar' },
  { code: 'KES', symbol: '/=', name: 'Kenyan Shilling' },
  { code: 'KGS', symbol: 'лв', name: 'Som' },
  { code: 'KHR', symbol: '៛', name: 'Riel' },
  { code: 'KPW', symbol: '₩', name: 'North Korean Won' },
  { code: 'KYD', symbol: '$', name: 'Cayman Islands Dollar' },
  { code: 'KRW', symbol: '₩', name: 'Won' },
  { code: 'KZT', symbol: '₸', name: 'Tenge' },
  { code: 'LAK', symbol: '₭', name: 'Kip' },
  { code: 'LBP', symbol: ' ل.ل.', name: 'Lebanese Pound' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lanka Rupee' },
  { code: 'LRD', symbol: 'L$', name: 'Liberian Dollar' },
  { code: 'LSL', symbol: 'L', name: 'Loti' },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  { code: 'MDL', symbol: 'L', name: 'Moldovan Leu' },
  { code: 'MGA', symbol: 'Ar', name: 'Malagasy Ariary' },
  { code: 'MKD', symbol: 'Ден', name: 'Denar' },
  { code: 'MMK', symbol: 'K', name: 'Kyat' },
  { code: 'MNT', symbol: 'T', name: 'Tugrik' },
  { code: 'MOP', symbol: 'MOP$', name: 'Pataca' },
  { code: 'MRU', symbol: 'UM', name: 'Ouguiya' },
  { code: 'MUR', symbol: '₨', name:'Mauritius Rupee' },
  { code: 'MVR', symbol: 'MRf', name: 'Rufiyaa' },
  { code: 'MWK', symbol: 'MK', name: 'Kwacha' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'MZN', symbol: 'MT', name: 'Mozambique Metical' },
  { code: 'NAD', symbol: 'N$', name: 'Namibia Dollar' },
  { code: 'NGN', symbol: '₦', name: 'Naira' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'NPR', symbol: 'Re.', name: 'Nepalese Rupee' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar' },
  { code: 'NIO', symbol: 'C$', name: 'Cordoba Oro' },
  { code: 'PAB', symbol: 'B/.', name: 'Balboa' },
  { code: 'PEN', symbol: 'S/', name: 'Nuevo Sol' },
  { code: 'PGK', symbol: 'K', name: 'Kina' },
  { code: 'PHP', symbol: 'P', name: 'Philippine Peso' },
  { code: 'PKR', symbol: 'Rs', name: 'Pakistan Rupee' },
  { code: 'PLN', symbol: 'zł', name: 'Zloty' },
  { code: 'PYG', symbol: '₲', name: 'Guarani' },
  { code: 'QAR', symbol: 'QR', name: 'Qatari Rial' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'RSD', symbol: 'din', name: 'Serbian Dinar' },
  { code: 'SAR', symbol: 'SR', name: 'Saudi Riyal' },
  { code: 'SBD', symbol: 'Si$', name: 'Solomon Islands Dollar' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar' },
  { code: 'SCR', symbol: 'SR', name: 'Seychelles Rupee' },
  { code: 'SDG', symbol: 'ج.س.', name: 'Sudanese Pound' },
  { code: 'SLL', symbol: 'Le', name: 'Leone' },
  { code: 'SOS', symbol: 'Sh.so.', name: 'Somali Shilling' },
  { code: 'SRD', symbol: '$', name: 'Surinam Dollar' },
  { code: 'SSP', symbol: '£', name: 'South Sudanese Pound' },
  { code: 'STN', symbol: 'Db', name: 'Dobra' },
  { code: 'SVC', symbol: 'SVC', name: 'El Salvador Colon' },
  { code: 'SYP', symbol: '£S', name: 'Syrian Pound' },
  { code: 'SZL', symbol: 'L', name: 'Lilangeni' },
  { code: 'TJS', symbol: 'ЅM', name: 'Somoni' },
  { code: 'THB', symbol: '฿', name: 'Baht' },
  { code: 'TMT', symbol: 'T', name: 'Turkmenistan New Manat' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar' },
  { code: 'TOP', symbol: 'T$', name: 'Pa’anga' },
  { code: 'TRY', symbol: 'TL', name: 'Turkish Lira' },
  { code: 'TTD', symbol: 'TT$', name: 'Trinidad and Tobago Dollar' },
  { code: 'TWD', symbol: '$', name: 'New Taiwan Dollar' },
  { code: 'TZS', symbol: 'TSh', name: 'Tanzanian Shilling' },
  { code: 'UYU', symbol: '$U', name: 'Peso Uruguayo' },
  { code: 'UZS', symbol: "so'm", name: 'Uzbekistan Sum' },
  { code: 'VND', symbol: '₫', name: 'Dong' },
  { code: 'WST', symbol: 'ST', name: 'Tala' },
  { code: 'ZAR', symbol: 'R', name: 'Rand' },
  { code: 'XOF', symbol: 'CFA', name: 'CFA Franc' },
  { code: 'XCD', symbol: '$', name: 'East Caribbean Dollar' },
  { code: 'YER', symbol: '﷼', name: 'Yemeni Rial' },
  { code: 'ZAR', symbol: 'R', name: 'Rand' },
  { code: 'ZMW', symbol: 'ZK', name: 'Zambian Kwacha' },
  { code: 'ZWL', symbol: 'Z$', name: 'Zimbabwe Dollar' },
];

export const worldCurrencyMap: ReadonlyMap<CurrencyCode, Currency> = new Map(
  worldCurrencies.map((currency) => [currency.code, currency]),
);
