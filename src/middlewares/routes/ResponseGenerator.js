class ResponseGenerator {
    static generateSuccess(res, payload) {
        res.send({ status: 'success', payload });
    }

    static generateServerError(res, error) {
        res.send({ status: 'error', error });
    }

    static generateUserError(res, error) {
        res.send({ status: 'user-error', error });
    }
}

export default ResponseGenerator;