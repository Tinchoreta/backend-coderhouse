class TextFileStrategy {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async save(data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(this.filePath, JSON.stringify(data), (error) => {
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
            fs.readFile(this.filePath, (error, data) => {
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
}