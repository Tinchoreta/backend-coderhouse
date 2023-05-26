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

    async insertOne(data) {
        try {
            await this.strategy.insertOne(data);
        } catch (error) {
            throw new Error('Error al insertar los datos');
        }
    }

    async modifyOne(query, data) {
        try {
            await this.strategy.modifyOne(query, data);
        } catch (error) {
            throw new Error('Error al modificar los datos');
        }
    }

    async deleteOne(query) {
        try {
            await this.strategy.deleteOne(query);
        } catch (error) {
            throw new Error('Error al eliminar los datos');
        }
    }
}

export default PersistenceManager;
