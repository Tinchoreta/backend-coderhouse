/*
Para la clase PersistenceManager se aplica el patrón Strategy 
para permitir la utilización de diferentes estrategias de almacenamiento de datos 
(por ejemplo, archivos de texto plano, bases de datos, etc.).
Entonces esta clase administra la persistencia, sea de dónde sea que venga.
Solo hay que implementar una clase Adapter para cada estrategia de persistencia.
*/

class PersistenceManager {
    constructor(strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy) {
        this.strategy = strategy;
    }

    async save(data) {
        try {
            await this.strategy.save(data);
        } catch (error) {
            throw new Error('Error al guardar los datos');
        }
    }

    async load() {
        try {
            return await this.strategy.load();
        } catch (error) {
            throw new Error('Error al cargar los datos');
        }
    }

    async delete() {
        try {
            return await this.strategy.delete();
        } catch (error) {
            throw new Error('Error al eliminar los datos');
        }
    }

    async addOne(query) {
        try {
            return await this.strategy.addOne(query);
        } catch (error) {
            throw new Error('Error al insertar los datos');
        }
    }

    async getOne(query) {
        try {
            return await this.strategy.getOne(query);
        } catch (error) {
            throw new Error('Error al obtener los datos');
        }
    }

    async getMany(filter = null, sortOptions = null, limit = null) {
        try {
            const query = {
                filter: filter ?? {},
                sortOptions: sortOptions ?? {},
                limit: limit ?? 0
            };

            return await this.strategy.getMany(query);
        } catch (error) {
            throw new Error('Error al obtener los datos');
        }
    }


    async insertOne(data) {
        try {
            return await this.strategy.insertOne(data);
        } catch (error) {
            throw new Error('Error al insertar los datos');
        }
    }

    async modifyOne(query, data) {
        try {
            return await this.strategy.modifyOne(query, data);
        } catch (error) {
            throw new Error('Error al modificar los datos');
        }
    }

    async deleteOne(query) {
        try {
            return await this.strategy.deleteOne(query);
        } catch (error) {
            throw new Error('Error al eliminar los datos');
        }
    }

    async populateMany(docs, options, foreignModel) {
        try {
            const populatedDocs = await this.strategy.populateMany(docs, options, foreignModel);
            return populatedDocs;
        } catch (error) {
            throw new Error(`populateMany: ${error.message}`);
        }
    }

    async aggregate(pipeline) {
        try {
            const result = await this.strategy.aggregate(pipeline);
            return result;
        } catch (error) {
            throw new Error(`aggregate: ${error.message}`);
        }
    }

    async find(filter) {
        try {
            const result = await this.strategy.find(filter);
            return result;
        } catch (error) {
            throw new Error(`find: ${error.message}`);
        }
    }

}

export default PersistenceManager;
