const { writeFile } = require('fs');
const targetPath = './src/environments/environment.custom.ts';
require('dotenv').config();
const version = require('./package.json').version;
const envConfigFile = `
export  const  environment  =  {
  production:  ${process.env['PRODUCTION']},
  backUrl:  '${process.env['ADRESSEAPI']}',
  version:  '${version}',
};
`;
writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log('Using  custom  environment');
  }
});
