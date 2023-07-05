import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";

async function inicializePassport() {
    
    passport.use(
        'register',
        new LocalStrategy({ passReqToCallback: true, usernameField: 'email' },
            async (req, username, password, done) => {
                try {
                    let existingUser = await User.findOne({ email: username });
                    if (!existingUser) { // && password === req.<PASSWORD>.confirmPassword ){
                        let newUser = await User.create(req.body)
                        return done(null, newUser)
                    }
                    return done(null, false)
                } catch (err) {
                    return done(err, false);
                }
            }
        )
    );

    passport.use(
        'signin',
        new LocalStrategy(
            { usernameField: 'email' },
            async (username, password, done) => {
                try {
                    let one = await User.findOne({ email: username })
                    console.log(one);
                    // if (one) {
                    //     return done(null, one)
                    // }
                    return done(null, one)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

}

passport.serializeUser(
    (user, done) => { done(null, user._id) }
);

passport.deserializeUser(
    async (id, done) => {
        const user = await User.findById({ _id: id });
        console.log(id);
        done(null, user)
    }
);

export default inicializePassport;