import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { usersModel } from "../models/index.mjs";

if (process.env.NODE_ENV === "prod") {
  dotenv.config({ path: ".env.prod" });
} else {
  dotenv.config({ path: ".env.dev" });
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

const createJwtStrategy = async () => {
  // jwt_payload is an object literal containing the decoded JWT payload.
  // decoded from the JWT is the _id of the user.
  const jwtStrategy = new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const userId = jwt_payload.user_id;
      const user = await usersModel.getUserById(userId);
      if (user) {
        // The first argument is an error, and the second argument is the user.
        return done(null, user);
      }
      // The first argument is an error, and the second argument is false.
      return done(null, false);
    } catch (error) {
      return done(error, false);
    }
  });

  return jwtStrategy;
};

export default createJwtStrategy;
