import fs from 'fs';
class UserManagerController {

    constructor(userManagerAdapter) {
        this.userManagerAdapter = userManagerAdapter;
    }

    async addUser(request, response) {
        try {
            const userData = request.body;
            if (!userData || Object.keys(userData).length === 0) {
                return response.status(400).json({
                    success: false,
                    error: "Bad Request: No user data provided",
                });
            }
            const addedUser = await this.createUser(userData);
            response.status(201).json(addedUser);
        } catch (error) {
            console.error("Error adding user:", error);
            response.status(500).json({
                success: false,
                error: "Internal Server Error",
            });
        }
    }

    async createUser(userData) {
        try {
            return await this.userManagerAdapter.addUser(userData);
        } catch (error) {
            throw new Error(`Error creating user: ${error.message}`);
        }
    }

    async getUsers(request, response) {
        try {
            const result = await this.userManagerAdapter.getUsers();

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

    async getUserById(request, response) {
        try {
            const userId = request.params.id;
            const userFound = await this.userManagerAdapter.getUserById(userId);
            if (userFound) {
                return response.status(200).json({
                    success: true,
                    user: userFound,
                });
            } else {
                return response.status(404).json({
                    success: false,
                    error: "User not found",
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

    async updateUser(request, response) {
        const userId = request.params.id;
        const updatedUserData = request.body;

        if (!userId || typeof userId !== "string") {
            return response.status(400).send({ message: "Invalid user ID" });
        }

        try {
            const updatedUser = await this.userManagerAdapter.updateUser(userId, updatedUserData);
            response.status(200).json(updatedUser);
        } catch (error) {
            console.error(`Error updating user with ID ${userId}: ${error.message}`);
            response.status(500).send({ message: "Unable to update the user" });
        }
    }

    async removeUser(request, response) {
        const userId = request.params.id;

        if (!userId) {
            return response.status(400).send({ message: "Invalid user ID" });
        }

        try {
            const isDeleted = await this.userManagerAdapter.deleteUser(userId);

            isDeleted
                ? response
                    .status(200)
                    .send({
                        success: true,
                        message: "User deleted successfully",
                    })
                : response
                    .status(400)
                    .send({
                        success: false,
                        message: "Unable to remove the user"
                    });
        } catch (error) {
            console.error(`Error removing user with ID ${userId}: ${error.message}`);
            response.status(500).send({ message: "Unable to remove the user" });
        }
    }

    async uploadProfileImage(req, res) {
        try {
            const userId = req.params.uid; 
            const fileName = req.file.filename; 

            const user = await this.userManagerAdapter.getUserById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }

            user.profileImage = fileName;
            await user.save();

            return res.status(200).json({ success: true, message: 'Imagen de perfil subida exitosamente' });
        } catch (error) {
            console.error('Error al subir imagen de perfil:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }

    async uploadDocument(req, res) {
        try {
            const userId = req.params.uid; 
            const files = req.files; 

            const user = await this.userManagerAdapter.getUserById(userId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
            }
            
            if (files && files.length > 0) {
                user.documents = files.map((file) => ({
                    name: file.originalname,
                    reference: file.filename,
                }));

                await user.save();
            }

            return res.status(200).json({ success: true, message: 'Documentos subidos exitosamente' });
        } catch (error) {
            console.error('Error al subir documentos:', error);
            return res.status(500).json({ success: false, message: 'Error interno del servidor' });
        }
    }


}

export default UserManagerController;
