import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import { where } from 'sequelize';
import { UserModel } from '../models/user';
import {
	generateHashedPassword,
	generateServerErrorCode,
	loginValidation,
	registerValidation,
} from '../utils/validation';
import {
	SOME_THING_WENT_WRONG,
	USER_DOES_NOT_EXIST,
	USER_EXISTS_ALREADY,
	WRONG_PASSWORD,
} from '../utils/constants';
import { UserCaloriesModel } from '../models/userCalories';
import { asyncWrap, checkValidation, removeSpaces } from '../utils/common';
import { uploadFile } from '../modules/awsModule';

const userController = express.Router();

const createUser = async ({ username, password, email }) => {
	const data = {
		username,
		email,
		password: generateHashedPassword(password),
	};

	await UserModel.create(data);
};

userController.get(
	'/',
	passport.authenticate('jwt', { session: false }),
	async (req, res) => {
		const users = await UserModel.findAll();
		res.status(200).json({ users });
	},
);

/**
 * POST/
 * Register a user
 */
userController.post('/register', registerValidation, async (req, res) => {
	const errorsAfterValidation = validationResult(req);

	if (!errorsAfterValidation.isEmpty()) {
		return res.status(400).json({
			code: 400,
			errors: errorsAfterValidation.mapped(),
		});
	}

	try {
		const {
			email,
			password,
			username,
			calories,
			fat,
			protein,
			carbs,
		} = req.body;
		const user = await UserModel.findOne({ where: { email } });

		if (!user) {
			await createUser({ email, password, username });

			// Sign token
			const newUser = await UserModel.findOne({ where: { email } });
			await UserCaloriesModel.create({
				calories,
				fat,
				protein,
				carbs,
				userId: newUser.id,
			});
			const token = jwt.sign({ email }, process.env.PASSPORT_SECRET, {
				expiresIn: 10000000,
			});
			const userToReturn = { ...newUser.toJSON(), ...{ token } };

			delete userToReturn.hashedPassword;

			res.status(200).json(userToReturn);
		} else {
			generateServerErrorCode(
				res,
				403,
				'register email error',
				USER_EXISTS_ALREADY,
				'email',
			);
		}
	} catch (e) {
		generateServerErrorCode(res, 500, e, SOME_THING_WENT_WRONG);
	}
});

userController.post('/login', loginValidation, async (req, res) => {
	const errorsAfterValidation = validationResult(req);

	if (!errorsAfterValidation.isEmpty()) {
		return res.status(400).json({
			code: 400,
			errors: errorsAfterValidation.mapped(),
		});
	}

	const { email, password } = req.body;
	const user = await UserModel.findOne({ where: { email } });

	if (user && user.email) {
		console.log(user);
		const isPasswordMatched = user.comparePassword(password);

		if (isPasswordMatched) {
			const token = jwt.sign({ email }, process.env.PASSPORT_SECRET, {
				expiresIn: 1000000,
			});
			const { avatar, username } = { ...user.toJSON() };

			res.status(200).json({
				avatar,
				email,
				username,
				token,
			});
		} else {
			generateServerErrorCode(
				res,
				403,
				'login password error',
				WRONG_PASSWORD,
				'password',
			);
		}
	} else {
		generateServerErrorCode(
			res,
			404,
			'login email error',
			USER_DOES_NOT_EXIST,
			'email',
		);
	}
});

userController.patch(
	'/',
	[
		passport.authenticate('jwt', { session: false }),
		body('password').custom((value, { req }) => {
			if (!value) {
				return true;
			}

			if (value !== req.body.confirmPassword) {
				throw new Error('Please provide 2 same passwords');
			}

			return true;
		}).isLength({ min: 8 }),
		body('email')
			.exists()
			.custom(async (value) => {
				const user = await UserModel.findOne({ where: { email: value } });

				if (user) {
					throw new Error(
						'Email is already in use, please try a different one!',
					);
				}

				return true;
			}),
		body('username')
			.exists()
			.custom(async (value) => {
				const user = await UserModel.findOne({ where: { username: value } });

				if (user) {
					throw new Error(
						'Username already in user, please enter a different one!',
					);
				}

				return true;
			}),
		checkValidation,
	],
	async (req, res) => {
		const userId = req.user.id;

		if (req.body.password) {
			const { password, email, username } = req.body;

			await UserModel.update(
				{ password: generateHashedPassword(password), email, username },
				{ where: { id: userId } },
			);
		} else {
			await UserModel.update({ ...req.body }, { where: { id: userId } });
		}

		const token = jwt.sign({ email: req.body.email }, process.env.PASSPORT_SECRET, {
			expiresIn: 1000000,
		});

		res.status(200).json({ token });
	},
);

userController.post(
	'/upload/image',
	[
		passport.authenticate('jwt', { session: false }),
		body('file', 'File is required'),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { file } = req.files;
		console.log(req.user);
		const userId = req.user.id;

		console.log(removeSpaces(file.name));

		const img = await uploadFile({
			Bucket: process.env.AWS_S3_USER_IMAGES_BUCKET,
			Key: removeSpaces(file.name),
			Body: file.data,
		});

		await UserModel.update({ avatar: img.Location }, { where: { id: userId } });

		res.status(200).json({ msg: 'success', url: img.Location });
	}),
);

export default userController;
