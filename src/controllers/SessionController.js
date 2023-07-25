class SessionController {
    getSessionInfo(req, res, next) {
        // Verificar si el usuario tiene una sesión activa
        // if (req.session && req.session.mail) {
        //     // Enviar información sobre la sesión del usuario
        //     return res.status(200).json({
        //         status: "success",
        //         message: "Session information retrieved successfully",
        //         sessionInfo: req.session.mail
        //     });
        // } else {
        //     // Si no hay sesión, enviar un error
        //     return res.status(401).json({
        //         status: "error",
        //         message: "No active session"
        //     });
        // }

        return res.status(401).json({
                status: "error",
                message: "No active session"
            });
    }
}

export default SessionController;
