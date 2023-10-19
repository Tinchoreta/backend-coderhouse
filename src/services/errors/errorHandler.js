import CustomError from "./CustomError.js";

const errorHandlerMiddleware = (error, req, res, next) => {
	console.error(error.stack)
	return res.status(500).json({
		status: 500,
		method: req.method,
		path: req.url,
		response: error.message
	})
}

const errorHandler = (error, next) => {
	console.error(error);
	const customError = error instanceof CustomError ? error : new CustomError({
		name: EnumeratedErrors.DATABASE_ERROR,
		cause: error.message
	});
	next(customError);
}

export { errorHandlerMiddleware, errorHandler };