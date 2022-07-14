const config = {
  invoiceRecipientData: JSON.parse(process.env.INVOICE_RECIPIENT_DATA),
  logoWidth: process.env.INVOICE_LOGO_WIDTH,
  logoHeight: process.env.INVOICE_LOGO_HEIGHT,
  logoPath: process.env.INVOICE_LOGO_PATH,
};

module.exports = config;
