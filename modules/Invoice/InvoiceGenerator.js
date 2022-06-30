const MicroInvoice = require('microinvoice');

module.exports = {
  // eslint-disable-next-line max-lines-per-function
  async createInvoice(filename, payment, grantApplication, invoiceId, invoiceConfig) {
    try {
      const myInvoice = new MicroInvoice({
        style: {
          header: {
            image: {
              path: './assets/logo.png',
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
                value: payment.date,
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
                    value: 'Grant',
                  },
                  {
                    value: 1,
                  },
                  {
                    value: payment.budget,
                    price: true,
                  },
                ],
              ],

              total: [
                {
                  label: 'Total without VAT',
                  value: payment.budget,
                  price: true,
                },
                {
                  label: 'VAT Rate',
                  value: '0%',
                },
                {
                  label: 'VAT Paid',
                  value: '0',
                  price: true,
                },
                {
                  label: 'Total paid with VAT',
                  value: payment.budget,
                  price: true,
                },
              ],
            },
          },
        },
      });

      myInvoice
        .generate('example.pdf')
        .then(() => {
          console.log('Invoice saved');
        })
        .catch((error) => {
          console.error(error);
        });

      return 'ok';

      //   return await myInvoice.generate(filename);
    } catch (err) {
      console.log(err);
      return null;
    }
  },
};
