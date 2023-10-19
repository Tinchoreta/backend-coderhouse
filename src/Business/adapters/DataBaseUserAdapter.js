import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import User from '../../models/user.model.js'; 
import mongoose from 'mongoose';
// import bcrypt from 'bcrypt';

class DataBaseUserAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseUserAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, User));
        this.model = User;
        DataBaseUserAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseUserAdapter.instance) {
            DataBaseUserAdapter.instance = new DataBaseUserAdapter(uri);
        }
        return DataBaseUserAdapter.instance;
    }

    async getUsers(limit = 100, page = 1, query = {}) {
        try {
            const options = {
                limit: !Number.isNaN(parseInt(limit)) ? parseInt(limit) : 100,
                page: !Number.isNaN(parseInt(page)) ? parseInt(page) : 1,
            };

            const result = await this.model.find(query).limit(options.limit).skip((options.page - 1) * options.limit);

            const totalCount = await this.model.countDocuments(query);

            return { users: result, totalCount };
        } catch (error) {
            throw new Error(`getUsers: ${error.message}`);
        }
    }

    async isValidUserId(userId) {
        try {
            return mongoose.isValidObjectId(userId);
        } catch (error) {
            throw new Error(`isValidUserId: ${error.message}`);
        }
    }

    async getUserById(id) {
        try {
            const isValidId = await this.isValidUserId(id);
            if (!isValidId) return null;

            return await this.model.findById(id);
        } catch (error) {
            throw new Error(`getUserById: ${error.message}`);
        }
    }

    // async hashPassword(password) {
    //     try {
    //         const salt = await bcrypt.genSalt(10);
    //         return await bcrypt.hash(password, salt);
    //     } catch (error) {
    //         throw new Error(`hashPassword: ${error.message}`);
    //     }
    // }

    async addUser(userToAdd) {
        try {
            // userToAdd.password = await this.hashPassword(userToAdd.password);
            return await this.model.create(userToAdd);
        } catch (error) {
            throw new Error(`addUser: ${error.message}`);
        }
    }

    async updateUser(userId, userToUpdate) {
        try {
            if (!userId) {
                throw new Error(`Invalid user ID: ${userId}`);
            }

            const updatedUserData = userToUpdate;

            const updatedUser = await this.model.findByIdAndUpdate(
                userId,
                updatedUserData,
                { new: true }
            );

            if (!updatedUser) {
                throw new Error(`User not found with ID: ${userId}`);
            }

            return updatedUser;
        } catch (error) {
            throw new Error(`updateUser: ${error.message}`);
        }
    }

    async deleteUser(idToDelete) {
        try {
            const id = idToDelete;
            if (!id) {
                throw new Error(`User ID "${idToDelete}" is not valid`);
            }

            const isDeleted = await this.model.findByIdAndDelete(id);

            return isDeleted ? true : false;

        } catch (error) {
            throw new Error(`deleteUser: ${error.message}`);
        }
    }

    async getUserByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            throw new Error(`getUserByEmail: ${error.message}`);
        }
    }
}

export default DataBaseUserAdapter;
