import multer from 'multer';
import fs from 'fs'; // Importa el módulo fs para trabajar con el sistema de archivos

// Ruta base para las carpetas de destino
const destinationBase = './public/files/';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Determina la carpeta de destino según el tipo de archivo
        let destinationFolder = '';

        if (file.fieldname === 'photo') {
            destinationFolder = 'profiles';
        } else if (file.fieldname === 'productImage') {
            destinationFolder = 'products';
        } else if (file.fieldname === 'documents') {
            destinationFolder = 'documents';
        }

        // Verifica si la carpeta de destino existe, de no ser así, la crea
        const destinationPath = destinationBase + destinationFolder;
        if (!fs.existsSync(destinationPath)) {
            fs.mkdirSync(destinationPath, { recursive: true });
        }

        cb(null, destinationPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const uploader = multer({ storage });

export default uploader;
