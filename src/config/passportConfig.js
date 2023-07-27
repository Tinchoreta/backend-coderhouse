import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";
import GHStrategy from "passport-github2";
import dotenv from 'dotenv';
import jwt from 'passport-jwt';

const JWTstrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;


dotenv.config();
const { GH_APP_ID, GH_CLIENT_ID, GH_CLIENT_SECRET, GH_CALLBACK } = process.env;


async function inicializePassport() {

    passport.use(
        'github',
        new GHStrategy(
            { clientID: GH_CLIENT_ID, clientSecret: GH_CLIENT_SECRET, callbackURL: GH_CALLBACK },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    //console.log(profile)
                    let one = await User.findOne({ email: profile._json.login })
                    if (!one) {
                        let user = await User.create({
                            name: profile._json.name,
                            email: profile._json.login,
                            age: 18,
                            photo: profile._json.avatar_url,
                            password: profile._json.id
                        })
                        return done(null, user)
                    }
                    return done(null, one)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )


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
                    // console.log(one);
                    return done(null, one)
                } catch (error) {
                    return done(error)
                }
            }
        )
    )

    passport.use(
        'jwt',
        new JWTstrategy({
            jwtFromRequest: ExtractJwt.fromExtractors([(req) => req?.cookies['token']]),
            secretOrKey: process.env.SECRET
        },
            async (jwtPayload, done) => {
                try {
                    let user = await User.findOne({ email: jwtPayload.email })
                    delete user.password
                    if (user) {
                        return done(null, user)
                    } else {
                        return done(null, false, { message: 'not auth' })
                    }
                } catch (error) {
                    return done(error, false)
                }
            })
    )

}

passport.serializeUser(
    (user, done) => { done(null, user._id) }
);

passport.deserializeUser(
    async (id, done) => {
        const user = await User.findById({ _id: id });
        // console.log(id);
        done(null, user)
    }
);

export default inicializePassport;