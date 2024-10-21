import passport from "passport";
import localStrategy from "./localStartegy.mjs";
import createJwtStrategy from "./jwtStrategy.mjs";

const initializePassport = async () => {
  passport.use(localStrategy);
  const jwtStrategy = await createJwtStrategy();
  passport.use(jwtStrategy);
};

initializePassport();

export default passport;
