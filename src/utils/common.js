import { validationResult } from 'express-validator';
import passport from 'passport';

export const asyncWrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

export const authenticateUser = (req, res, next) => new Promise((resolve) => {
	passport.authenticate('jwt', (error, result) => {
		if (error) {
			console.log(error);
			res.status(401);
		} else {
			console.log(result);
			resolve(result);
		}
	})(req, res, next);
});

export const checkValidation = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			code: 422,
			errors: errors.mapped(),
		});
	}

	next();
};

export const removeSpaces = (string) => string.replace(/ /g, '');
