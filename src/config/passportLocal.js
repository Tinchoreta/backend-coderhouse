import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/user.model.js";

function inicializePassport() {
    passport.serializeUser(
        (user, done) => done(null, user._id)
    )
    
    passport.deserializeUser(
        async (id, done) => {
            const user = await User.findById(id);
            return done(null, user)
        }
    )
    
}
export default inicializePassport;