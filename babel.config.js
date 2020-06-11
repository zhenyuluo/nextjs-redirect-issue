const isProduction = process.env.NODE_ENV === `production`;

module.exports = {
  presets: [
    `next/babel`,
  ],
  plugins: [
    [`import`, { libraryName: `antd`, style: true }, `antd`],
  ]
};
