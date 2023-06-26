class CustomerManagerController {

    constructor(customerManagerAdapter) {
        this.customerManagerAdapter = customerManagerAdapter;
    }

    async addCustomer(request, response, next) {
        try {
            const customerData = request.body;
            if (!customerData || Object.keys(customerData).length === 0) {
                return response.status(400).json({
                    success: false,
                    error: "Bad Request: No customer data provided",
                });
            }

            const addedCustomer = await this.createCustomer(customerData);
            response.status(201).json(addedCustomer);
        } catch (error) {
            console.error("Error adding customer:", error);
            response.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }

    async createCustomer(customerData) {
        const {
            address,
            ...customerFields
        } = customerData;

        try {
            const existingAddress = await this.checkExistingAddress(address);
            const addedAddress = existingAddress || await this.addAddress(address);
            const customerToAdd = this.createCustomerData(customerFields, addedAddress);

            return await this.customerManagerAdapter.addCustomer(customerToAdd);
        } catch (error) {
            throw new Error(`Error creating customer: ${error.message}`);
        }
    }

    async checkExistingAddress(address) {
        try {
            const existingAddress = await this.customerManagerAdapter.getAddressByFields(address);
            return existingAddress;
        } catch (error) {
            throw new Error(`Error checking existing address: ${error.message}`);
        }
    }

    async addAddress(address) {
        try {
            const addressFields = {
                ...address
            };
            const addedAddress = await this.customerManagerAdapter.addAddress(addressFields);
            return addedAddress;
        } catch (error) {
            throw new Error(`Error adding address: ${error.message}`);
        }
    }

    createCustomerData(customerFields, addedAddress) {
        const customerToAdd = {
            ...customerFields,
            addresses: [addedAddress._id]
        };
        return customerToAdd;
    }


    async getCustomers(request, response) {
        try {
            const result = await this.customerManagerAdapter.getCustomers();

            return response.status(200).json({
                status: "success",
                payload: result,
            });
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                status: "error",
                error: "Internal Server Error",
            });
        }
    }

    async getCustomerById(request, response) {
        try {
            const customerId = request.params.id;
            const customerFound = await this.customerManagerAdapter.getCustomerById(customerId);
            if (customerFound) {
                return response.status(200).json({
                    success: true,
                    customer: customerFound,
                });
            } else {
                return response.status(404).json({
                    success: false,
                    error: "Customer not found",
                });
            }
        } catch (error) {
            console.error(error);
            return response.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }

    async updateCustomer(request, response) {
        const customerId = request.params.id;
        const updatedCustomerData = request.body;

        if (!customerId || typeof customerId !== "string") {
            return response.status(400).send({ message: "Invalid customer ID" });
        }

        try {
            const updatedCustomer = await this.updateCustomerData(customerId, updatedCustomerData);
            response.status(200).json(updatedCustomer);
        } catch (error) {
            console.error(`Error updating customer with ID ${customerId}: ${error.message}`);
            response.status(500).send({ message: "Unable to update the customer" });
        }
    }

    async updateCustomerData(customerId, updatedCustomerData) {
        try {
            if (!customerId) {
                throw new Error(`Invalid customer ID: ${customerId}`);
            }

            const { addresses, password, ...customerFields } = updatedCustomerData;

            if (password) {
                // Verificar si el password proporcionado ya está hasheado
                const isHashedPassword = password.startsWith('$2');

                if (!isHashedPassword) {
                    // Si el password no está hasheado, realizar el tratamiento de hash
                    customerFields.password = await this.customerManagerAdapter.hashPassword(password);
                } else {
                    // Si el password ya está hasheado, utilizarlo sin modificar
                    customerFields.password = password;
                }
            }

            const updatedAddresses = await this.#updateAddresses(addresses);
            customerFields.addresses = updatedAddresses;

            return await this.customerManagerAdapter.updateCustomer(customerId, customerFields);
        } catch (error) {
            throw new Error(`Error updating customer data: ${error.message}`);
        }
    }

    async #updateAddresses(addresses) {
        if (!addresses || !Array.isArray(addresses)) {
            return [];
        }

        const updatedAddresses = [];

        for (const address of addresses) {
            if (address._id) {
                // Si existe el _id de la dirección, actualizar sus campos
                const updatedAddress = await this.updateAddress(address._id, address);
                updatedAddresses.push(updatedAddress._id);
            } else {
                // Si no existe el _id de la dirección, agregar una nueva dirección
                const addedAddress = await this.customerManagerAdapter.addAddress(address);
                updatedAddresses.push(addedAddress._id);
            }
        }

        return updatedAddresses;
    }

    async updateAddress(addressId, updatedAddressData) {
        try {
            const existingAddress = await this.customerManagerAdapter.getAddressById(addressId);

            if (!existingAddress) {
                throw new Error(`Address not found with ID: ${addressId}`);
            }

            // Actualizar los campos de la dirección existente
            Object.assign(existingAddress, updatedAddressData);
            await existingAddress.save();

            return existingAddress;
        } catch (error) {
            throw new Error(`Error updating address with ID ${addressId}: ${error.message}`);
        }
    }


    async removeCustomer(request, response) {
        const customerId = request.params.id;

        if (!customerId) {
            return response.status(400).send({ message: "Invalid customer ID" });
        }

        try {
            const isDeleted = await this.customerManagerAdapter.deleteCustomer(customerId);

            isDeleted
                ? response
                    .status(200)
                    .send({
                        success: true,
                        message: "Customer deleted successfully",
                    })
                : response
                    .status(400)
                    .send({
                        success: false,
                        message: "Unable to remove the customer"
                    });
        } catch (error) {
            console.error(`Error removing customer with ID ${customerId}: ${error.message}`);
            response.status(500).send({ message: "Unable to remove the customer"
            });
        }
    }
}

export default CustomerManagerController;