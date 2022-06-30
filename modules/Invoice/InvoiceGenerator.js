/* eslint-disable max-lines-per-function */
const path = require('path');
const MicroInvoice = require('microinvoice');

module.exports = {
  async createInvoice(filename, payment, grantApplication, invoiceId, invoiceConfig) {
    try {
      return new Promise((resolve, reject) => {
        const myInvoice = new MicroInvoice({
          style: {
            header: {
              image: {
                path: path.join(__dirname, '../../assets/logo.png'),
                width: invoiceConfig.logoWidth,
                height: invoiceConfig.logoHeight,
              },
            },
          },
          data: {
            invoice: {
              name: 'Invoice',

              header: [
                {
                  label: 'Invoice Number',
                  value: invoiceId,
                },
                {
                  label: 'Status',
                  value: payment.status,
                },
                {
                  label: 'Date',
                  value: payment.date.toLocaleDateString('en-US'),
                },
              ],

              currency: payment.currency,

              customer: [
                {
                  label: 'Bill To',
                  value: invoiceConfig.invoiceRecipientData,
                },
              ],

              seller: [
                {
                  label: 'Bill From',
                  value: [
                    `${grantApplication.firstname} ${grantApplication.lastname}`,
                    grantApplication.addressCountry,
                    grantApplication.addressCity,
                    grantApplication.addressStreet,
                    grantApplication.addressZip,
                    grantApplication.email,
                  ],
                },
                //   {
                //     label: 'Tax Identifier',
                //     value: '5345345345435345345',
                //   },
              ],

              legal: [
                {
                  value: `Near account Id: ${grantApplication.nearId}`,
                  weight: 'bold',
                  color: 'primary',
                },
                //   {
                //     value: 'sed do eiusmod tempor incididunt ut labore et dolore magna.',
                //     weight: 'bold',
                //     color: 'secondary',
                //   },
              ],

              details: {
                header: [
                  {
                    value: 'Description',
                  },
                  {
                    value: 'Quantity',
                  },
                  {
                    value: 'Subtotal',
                  },
                ],

                parts: [
                  [
                    {
                      value: `Grant for ${grantApplication.name}`,
                    },
                    {
                      value: 1,
                    },
                    {
                      value: payment.amount,
                      price: true,
                    },
                  ],
                ],

                total: [
                  {
                    label: 'Total without VAT',
                    value: payment.amount,
                    price: true,
                  },
                  {
                    label: 'VAT Rate',
                    value: '0%',
                  },
                  {
                    label: 'VAT Paid',
                    value: '0.00',
                    price: true,
                  },
                  {
                    label: 'Total paid with VAT',
                    value: payment.amount,
                    price: true,
                  },
                ],
              },
            },
          },
        });

        const filePath = path.join(__dirname, '../../tmp/', filename);

        myInvoice
          .generate(filePath)
          .then(() => {
            resolve(filePath);
          })
          .catch((error) => {
            reject(error);
          });
      });
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
