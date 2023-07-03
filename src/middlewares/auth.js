function auth(req, res, next) {
    if (req.session?.email === 'tincho@landia.com') {
        return next()
    }
    return res.status(401).json({
        success: false,
        message: 'Autorization failed'
    })
}

export default auth;