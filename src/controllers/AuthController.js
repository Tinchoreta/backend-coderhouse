class AuthController {
    async getCounter(request, response) {
        try {
            if (!request.session.counter) {
                request.session.counter = 1;
            } else {
                request.session.counter++;
            }
            return response.status(200).json({ message: `han ingresado ${request.session.counter} usuarios` });
        } catch (error) {
            console.error("Error getting counter:", error);
            return response.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }

    async login(request, response, next) {
        try {
            const { mail } = request.body;
            if (!mail) {
                return response.status(400).json({ success: false, error: "Bad Request: No mail provided" });
            }
            request.session.mail = mail;
            return response.status(200).json({ message: `${request.session.mail} ha iniciado sesión` });
        } catch (error) {
            console.error("Error logging in:", error);
            next();
        }
    }

    async getPrivateContent(request, response) {
        try {
            return response.status(200).json({ message: 'administrador autorizado' });
        } catch (error) {
            console.error("Error getting private content:", error);
            return response.status(500).json({ success: false, error: "Internal Server Error" });
        }
    }

    async logout(request, response, next) {
        try {
            request.session.destroy();
            return response.status(200).json({ message: `ha cerrado sesión` });
        } catch (error) {
            console.error("Error logging out:", error);
            next();
        }
    }
}

export default AuthController;
