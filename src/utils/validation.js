import sha256 from 'sha256';
import { check } from 'express-validator';
import {
	PASSWORD_IS_EMPTY,
	PASSWORD_LENGTH_MUST_BE_MORE_THAN_8,
	EMAIL_IS_EMPTY,
	EMAIL_IS_IN_WRONG_FORMAT, CALORIES_NOT_PROVIDED, CARBS_NOT_PROVIDED, FAT_NOT_PROVIDED,
} from './constants';

export const generateHashedPassword = (password) => sha256(password);

export function generateServerErrorCode(
	res,
	code,
	fullError,
	msg,
	location = 'server',
) {
	const errors = {};
	errors[location] = {
		fullError,
		msg,
	};
	return res.status(code).json({
		code,
		fullError,
		errors,
	});
}

export const registerValidation = [
	check('email')
		.exists()
		.withMessage(EMAIL_IS_EMPTY)
		.isEmail()
		.withMessage(EMAIL_IS_IN_WRONG_FORMAT),
	check('password')
		.exists()
		.withMessage(PASSWORD_IS_EMPTY)
		.isLength({ min: 8 })
		.withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
	check('calories')
		.exists()
		.withMessage(CALORIES_NOT_PROVIDED),
	check('protein')
		.exists()
		.withMessage(CALORIES_NOT_PROVIDED),
	check('carbs')
		.exists()
		.withMessage(CARBS_NOT_PROVIDED),
	check('fat')
		.exists()
		.withMessage(FAT_NOT_PROVIDED),
];

export const loginValidation = [
	check('email')
		.exists()
		.withMessage(EMAIL_IS_EMPTY)
		.isEmail()
		.withMessage(EMAIL_IS_IN_WRONG_FORMAT),
	check('password')
		.exists()
		.withMessage(PASSWORD_IS_EMPTY)
		.isLength({ min: 8 })
		.withMessage(PASSWORD_LENGTH_MUST_BE_MORE_THAN_8),
];
