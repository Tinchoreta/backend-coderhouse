/*
Para la clase TextFileStrategy, forma parte del patrón Strategy para permitir la utilización de diferentes estrategias de almacenamiento de datos (por ejemplo, archivos de texto plano, bases de datos, etc.).
En este caso la estrategia de persistencia es a través de archivos de Texto.
*/

const ENCODING = "utf-8"

const fs = require('fs');
class TextFileStrategy {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async save(data) {
        return new Promise((resolve, reject) => {
            
            fs.writeFile(this.filePath, JSON.stringify(data, null,2), ENCODING, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }

    async load() {
        return new Promise((resolve, reject) => {
            
            fs.readFile(this.filePath, ENCODING, (error, data) => {
                if (error) {
                    if (error.code === 'ENOENT') {
                        // Archivo no encontrado
                        resolve([]);
                    } else {
                        reject(error);
                    }
                } else {
                    resolve(JSON.parse(data));
                }
            });
        });
    }

    async delete() {
        return new Promise((resolve, reject) => {
            fs.unlink(this.filePath, (error) => {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

module.exports = TextFileStrategy;