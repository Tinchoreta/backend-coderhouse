import path from 'path';
import dotenv from 'dotenv';
import commander from '../utils/commander.js';
import __dirname from '../utils.js';

console.log(commander.opts())
const { mode } = commander.opts();

// Se obtiene la ruta absoluta del directorio de la carpeta 'config
const configDir = path.resolve(__dirname);
console.log(configDir);

// Se configuran las rutas a los archivos .env.development y .env.production
const envDevelopmentPath = path.join(configDir, '../.env.development');
const envProductionPath = path.join(configDir, '../.env.production');

console.log(envDevelopmentPath);
console.log(envProductionPath);

dotenv.config({
    path: mode === 'development' ? envDevelopmentPath : envProductionPath
});

export const config = {
    privateKeyJwt: process.env.SECRET_KEY_JWT || 'secretoo',
    PORT: process.env.PORT || 8000,
    MONGO_DB_URI: process.env.MONGO_DB_URI || '',
    SECRET_COOKIE: process.env.SECRET_COOKIE || '',
    SECRET_SESSION: process.env.SECRET_SESSION || '',
    GH_APP_ID: process.env.GH_APP_ID || '',
    GH_CLIENT_ID: process.env.GH_CLIENT_ID || '',
    GH_CLIENT_SECRET: process.env.GH_CLIENT_SECRET || '',
    GH_CALLBACK: process.env.GH_CALLBACK || '',
    GMAIL_USER_APP: process.env.GMAIL_USER_APP || '',
    GMAIL_PASS_APP: process.env.GMAIL_PASS_APP || '',
    TWILIO_SID: process.env.TWILIO_SID || '',
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    TWILIO_PHONE_NUMBER: process.env.TWILIO_PHONE_NUMBER || '',
    TWILIO_WHATSAPP: process.env.TWILIO_WHATSAPP || '',
    MY_PHONE: process.env.MY_PHONE || '',

};

/* PORT = 
MONGO_DB_USER = 
MONGO_DB_PASSWORD = 
MONGO_DB_URI = 
SECRET_COOKIE = 
SECRET_SESSION = 
GH_APP_ID = 
GH_CLIENT_ID = 
GH_CLIENT_SECRET = 
GH_CALLBACK = http://localhost:8080/api/auth/github/callback
SECRET_KEY_JWT = 
TWILIO_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=+
MY_PHONE=+

*/