import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";

function inicializePassport() {
    passport.serializeUser(
        (user, done) => done(null, user._id)
    );

    passport.deserializeUser(
        async (id, done) => {
            const user = await User.findById(id);
            return done(null, user)
        }
    );
    passport.use(
        'register',
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                try {
                    let existingUser = await User.findOne({ email:username });
                    if (!existingUser) { // && password === req.<PASSWORD>.confirmPassword ){
                        let newUser = await User.create(req.body)
                        return done(null, user)
                    }
                    return done(null, false)
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );

}
export default inicializePassport;