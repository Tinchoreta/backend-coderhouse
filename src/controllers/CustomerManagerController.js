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
        const updatedCustomer = request.body;

        if (!customerId || typeof customerId !== "string") {
            return response.status(400).send({ message: "Invalid customer ID" });
        }

        if (!updatedCustomer || typeof updatedCustomer !== "object") {
            return response.status(400).send({ message: "Invalid update data" });
        }

        try {
            const customer = await this.customerManagerAdapter.updateCustomer(customerId, updatedCustomer);
            response.status(200).json(customer);
        } catch (error) {
            console.error(`Error updating customer with ID ${customerId}: ${error.message}`);
            response.status(500).send({ message: "Unable to update the customer" });
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