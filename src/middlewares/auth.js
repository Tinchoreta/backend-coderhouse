function auth(req, res, next) {
    if (req.session?.mail === 'admin@admin.com') {
        return next()
    }
    return res.status(401).json({
        success: false,
        message: 'Autorization failed'
    })
}

export default auth;