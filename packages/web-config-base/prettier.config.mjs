const config = {
  $schema: 'http://json.schemastore.org/prettierrc',
  trailingComma: 'all',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  printWidth: 120,
  importOrderParserPlugins: ['typescript', 'jsx', 'decorators-legacy'],
  plugins: ['@trivago/prettier-plugin-sort-imports'],
  importOrder: [
    '^(inversify)|(mobx)|(mobx-react-lite)|(rxjs)|(tsjam)|(i18next)|(react)(.*)$',
    '^@(.*)$',
    '<THIRD_PARTY_MODULES>',
    '^[../]',
    '^[./]',
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: false,
  importOrderGroupNamespaceSpecifiers: true,
  importOrderCaseInsensitive: true,
};

export default config;
