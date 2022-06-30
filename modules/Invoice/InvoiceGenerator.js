/* eslint-disable max-lines-per-function */
const path = require('path');
const MicroInvoice = require('microinvoice');

module.exports = {
  async createInvoice({ filename, payment, grantApplication, invoiceId, invoiceConfig, t }) {
    try {
      return new Promise((resolve, reject) => {
        const myInvoice = new MicroInvoice({
          style: {
            header: {
              image: {
                path: path.join(__dirname, '../../assets/logo.png'),
                width: parseInt(invoiceConfig.logoWidth, 10),
                height: parseInt(invoiceConfig.logoHeight, 10),
              },
            },
          },
          data: {
            invoice: {
              name: t('invoice.title'),

              header: [
                {
                  label: t('invoice.number'),
                  value: invoiceId,
                },
                {
                  label: t('invoice.status'),
                  value: payment.status,
                },
                {
                  label: t('invoice.date'),
                  value: payment.date.toLocaleDateString('en-US'),
                },
              ],

              currency: payment.currency,

              customer: [
                {
                  label: t('invoice.to'),
                  value: invoiceConfig.invoiceRecipientData,
                },
              ],

              seller: [
                {
                  label: t('invoice.from'),
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
                  value: `${t('invoice.near_account')} ${grantApplication.nearId}`,
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
                    value: t('invoice.description'),
                  },
                  {
                    value: t('invoice.quantity'),
                  },
                  {
                    value: t('invoice.subtotal'),
                  },
                ],

                parts: [
                  [
                    {
                      value: `${t('invoice.grant_for')} ${grantApplication.projectName}`,
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
                    label: t('invoice.without_vat'),
                    value: payment.amount,
                    price: true,
                  },
                  {
                    label: t('invoice.vat_rate'),
                    value: '0%',
                  },
                  {
                    label: t('invoice.vat_paid'),
                    value: '0.00',
                    price: true,
                  },
                  {
                    label: t('invoice.total'),
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
      return null;
    }
  },
};
