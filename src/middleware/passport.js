import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserModel } from '../models/user';

export const applyPassportStrategy = (passport) => {
	const options = {};

	options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
	options.secretOrKey = process.env.PASSPORT_SECRET;

	passport.use(
		new Strategy(options, async (payload, done) => {
			try {
				const user = await UserModel.findOne({
					where: { email: payload.email },
				});

				if (user) {
					return done(null, {
						email: user.email,
						id: user.id,
					});
				}

				return done(null, false);
			} catch (error) {
				return done(error, false);
			}
		}),
	);
};
