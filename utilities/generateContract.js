const fs = require('fs');
const path = require('path');
const { createReport } = require('docx-templates');

const generateContract = async (templatePath, grantApplication) => {
  try {
    const template = fs.readFileSync(templatePath);
    const { firstname } = grantApplication;

    const buffer = await createReport({
      template,
      cmdDelimiter: ['${', '}'],
      data: {
        name: firstname,
        hello: 'world',
      },
    });

    const fileName = 'tmp/agreement.docx';
    fs.writeFileSync(path.join(__dirname, '..', fileName), buffer);

    return fileName;
  } catch (err) {
    console.log(err);
    return null;
  }
};

module.exports = generateContract;
