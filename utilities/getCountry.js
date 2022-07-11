const Countries = require('@kycdao/kycdao-sdk/dist/countries.list.json');

const getCountry = (countryCode) => {
  const countryItem = Countries.find((country) => country.iso_cca2 === countryCode);
  return countryItem ? countryItem.name : '';
};

module.exports = getCountry;
