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

};

/* PORT = 8080
MONGO_DB_USER = tinchoreta
MONGO_DB_PASSWORD = Cocohueso23
MONGO_DB_URI = mongodb + srv://tinchoreta:Cocohueso23@cluster0.xgzbctr.mongodb.net/coder-ecommerce
SECRET_COOKIE = CocoCookie83
SECRET_SESSION = CocoSession83
GH_APP_ID = 353399
GH_CLIENT_ID = Iv1.dc73dc3d536762cc
GH_CLIENT_SECRET = 896ce1a37448dfc2a96407c32d4e1fe7081c778a
GH_CALLBACK = http://localhost:8080/api/auth/github/callback
SECRET_KEY_JWT = N1n0S3cr3t */