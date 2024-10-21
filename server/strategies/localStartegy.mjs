import { Strategy as LocalStrategy } from "passport-local";

import { usersModel } from "../models/index.mjs";

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
    passReqToCallback: true,
  },
  async (req, email, password, done) => {
    try {
      const user = await usersModel.login({ email, password });

      if (!user) {
        return done(null, false, { message: "Invalid credentials." });
      }

      return done(null, user);
    } catch (error) {
      {
        if (error.message === "User not found.") {
          return done(null, false, { message: error.message });
        }
        return done(error);
      }
    }
  },
);

export default localStrategy;
