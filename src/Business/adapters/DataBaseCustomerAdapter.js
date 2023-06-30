import PersistenceManager from '../../persistence/PersistenceManager.js';
import DataBaseStrategy from '../../persistence/DataBaseStrategy.js';
import Customer from '../../models/customer.model.js';
import Address from '../../models/address.model.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

class DataBaseCustomerAdapter {
    static instance;

    constructor(uri) {
        if (DataBaseCustomerAdapter.instance) {
            throw new Error("Ya existe una instancia de esta clase");
        }
        this.persistenceManager = new PersistenceManager(new DataBaseStrategy(uri, Customer));
        this.model = Customer;
        DataBaseCustomerAdapter.instance = this;
    }

    static getInstance(uri) {
        if (!DataBaseCustomerAdapter.instance) {
            DataBaseCustomerAdapter.instance = new DataBaseCustomerAdapter(uri);
        }
        return DataBaseCustomerAdapter.instance;
    }

    async getCustomers(limit = 100, page = 1, query = {}) {
        try {
            const options = {
                limit: !Number.isNaN(parseInt(limit)) ? parseInt(limit) : 100,
                page: !Number.isNaN(parseInt(page)) ? parseInt(page) : 1,
            };

            const result = await this.model.find(query).limit(options.limit).skip((options.page - 1) * options.limit);

            const totalCount = await this.model.countDocuments(query);

            return { customers: result, totalCount };
        } catch (error) {
            throw new Error(`getCustomers: ${error.message}`);
        }
    }

    async isValidCustomerId(customerId) {
        try {
            return mongoose.isValidObjectId(customerId);
        } catch (error) {
            throw new Error(`isValidCustomerId: ${error.message}`);
        }
    }

    async getCustomerById(id) {
        try {
            const isValidId = await this.isValidCustomerId(id);
            if (!isValidId) return null;

            return await this.model.findById(id);
        } catch (error) {
            throw new Error(`getCustomerById: ${error.message}`);
        }
    }

    async hashPassword (password)  {
        try {
            const salt = await bcrypt.genSalt(10);
            return await bcrypt.hash(password, salt);
        } catch (error) {
            throw new Error(`hashPassword: ${error.message}`);
        }
    }

    async addCustomer(customerToAdd) {
        try {
            customerToAdd.password = await this.hashPassword(customerToAdd.password);
            return await this.model.create(customerToAdd);
        } catch (error) {
            throw new Error(`addCustomer: ${error.message}`);
        }
    }

    async addAddress(addressToAdd) {
        try {
            return await Address.create(addressToAdd);
        } catch (error) {
            throw new Error(`addAddress: ${error.message}`);
        }
    }

    async getAddressById(addressId) {
        try {
            return await Address.findById(addressId);
        } catch (error) {
            throw new Error(`getAddressById: ${error.message}`);
        }
    }

    getAddressByFields(address) {
        try {
            const existingAddress = Address.findOne({
                addressLine1: address.addressLine1,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country
            }).exec();

            return existingAddress;
        } catch (error) {
            throw new Error(`Error checking existing address: ${error.message}`);
        }
    }

    async updateCustomer(customerId, customerToUpdate) {
        try {
            if (!customerId) {
                throw new Error(`Invalid customer ID: ${customerId}`);
            }

            const { addresses, ...updatedCustomerData } = customerToUpdate;

            if (addresses && addresses.length > 0) {
                // Si se proporciona una lista de direcciones, se actualizan los campos de cada una
                const updatedAddresses = await Promise.all(
                    addresses.map(async (address) => {
                        const { _id, ...updatedAddressData } = address;
                        if (_id) {
                            // Si existe el ID de la dirección, se actualizan sus campos
                            const updatedAddress = await this.updateAddress(_id, updatedAddressData);
                            return updatedAddress;
                        } else {
                            // Si no existe el ID de la dirección, se crea una nueva dirección
                            const addedAddress = await this.addAddress(updatedAddressData);
                            return addedAddress;
                        }
                    })
                );

                // Se actualizan las referencias de direcciones en el cliente
                updatedCustomerData.addresses = updatedAddresses.map((address) => address._id);
            }

            const updatedCustomer = await this.model.findByIdAndUpdate(
                customerId,
                updatedCustomerData,
                { new: true }
            );

            if (!updatedCustomer) {
                throw new Error(`Customer not found with ID: ${customerId}`);
            }

            return updatedCustomer;
        } catch (error) {
            throw new Error(`updateCustomer: ${error.message}`);
        }
    }

    async updateAddress(addressId, updatedAddressData) {
        try {
            if (!addressId) {
                throw new Error(`Invalid address ID: ${addressId}`);
            }

            const updatedAddress = await Address.findByIdAndUpdate(
                addressId,
                updatedAddressData,
                { new: true }
            );

            if (!updatedAddress) {
                throw new Error(`Address not found with ID: ${addressId}`);
            }

            return updatedAddress;
        } catch (error) {
            throw new Error(`updateAddress: ${error.message}`);
        }
    }


    async deleteCustomer(idToDelete) {
        try {
            const id = idToDelete;
            if (!id) {
                throw new Error(`Customer ID "${idToDelete}" is not valid`);
            }

            const isDeleted = await this.model.findByIdAndDelete(id);

            return isDeleted ? true : false;

        } catch (error) {
            throw new Error(`deleteCustomer: ${error.message}`);
        }
    }

    async getCustomerByEmail(email) {
        try {
            return await this.model.findOne({ email });
        } catch (error) {
            throw new Error(`getCustomerByEmail: ${error.message}`);
        }
    }
}

export default DataBaseCustomerAdapter;
