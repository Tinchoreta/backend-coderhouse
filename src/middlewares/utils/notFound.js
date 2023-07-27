const notFoundHandler = (req, res, next) => {
    console.log(`Not found ${req.method} ${req.url}`)
    return res.status(404).json({
        status: 404,
        method: req.method,
        path: req.url,
        response: 'Resource not found'
    })
}

export default notFoundHandler;