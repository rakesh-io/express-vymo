const handleServerError = (error, next, collection, method) => {
    console.log(error);
    const httpError = createHttpError('Failed to ' + method + ' the' + collection + '. Please try later', 500);
    return next(httpError);
};

const handleValidationError = (error, next) => {
    const error = createHttpError('Invalid inputs passed, please check your data', 400);
    console.log(validationErrors);
    return next(error);
}

module.exports = { handleServerError, handleValidationError };
