const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');
const logger = require('./logger');
const config = require('../config/hellosign');

const generateContract = async (templatePath, grantApplication) => {
  try {
    const template = fs.readFileSync(templatePath);
    const { id, nearId } = grantApplication;

    const buffer = await createReport({
      template,
      cmdDelimiter: ['${', '}'],
      data: {
        ...grantApplication.toObject(),
        adminEmail: config.adminEmail,
        adminName: config.adminName,
      },
    });

    const fileName = `tmp/generated-agreement-${nearId}-${id}-${Date.now()}-${Math.floor(Math.random() * 100000)}.docx`;
    fs.writeFileSync(path.join(__dirname, '..', fileName), buffer);

    return fileName;
  } catch (err) {
    logger.error(err);
    return null;
  }
};

module.exports = generateContract;
