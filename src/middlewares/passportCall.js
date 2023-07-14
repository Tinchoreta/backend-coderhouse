import passport from "passport";

function authenticate(strategy) {
    return function (req, res, next) {
        passport.authenticate(strategy, (err, user, info) => {
            if (err || !user) {
                return handleErrors(err, user, info, res);
            }
            req.user = user;
            next();
        })(req, res, next);
    }
}

function handleErrors(err, user, info, res) {
    console.log({ err, user, info });
    const error = err || (info.messages ? info.messages : info.toString());
    res.status(401).json({ 
        success: false,
        error 
    });
}

export default function (strategy) {
    return authenticate(strategy);
};
