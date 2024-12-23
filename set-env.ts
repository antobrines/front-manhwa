const { writeFile } = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const version = require('./package.json').version;

// Détecte si on est en configuration `custom`
const isCustomConfig = process.argv.includes('--custom');
const envFilePath = isCustomConfig 
    ? path.resolve(__dirname, '.env.production') 
    : path.resolve(__dirname, '.env');

// Charge le bon fichier .env
dotenv.config({ path: envFilePath });

const targetPath = './src/environments/environment.custom.ts';

const envConfigFile = `
export const environment = {
  production: ${process.env['PRODUCTION']},
  backUrl: '${process.env['ADRESSEAPI']}',
  version: '${version}',
};
`;

writeFile(targetPath, envConfigFile, function (err: any) {
  if (err) {
    throw console.error(err);
  } else {
    console.log(`Using ${isCustomConfig ? 'production' : 'default'} environment`);
  }
});
