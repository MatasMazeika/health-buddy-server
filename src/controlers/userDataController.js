import express from 'express';
import { body } from 'express-validator';
import { asyncWrap, checkValidation } from '../utils/common';
import { UserCaloriesModel } from '../models/userCalories';
import { getUserConsumedFoodByDate } from '../modules/consumedFoodModule';
import { uploadFile } from '../modules/awsModule';
import { UserModel } from '../models/user';

const userDataController = express.Router();

/**
 * Get all needed user data for initial app load
 */
userDataController.post(
	'/initiate',
	[
		body('startDate', 'Start date is required').exists(),
		body('endDate', 'End date is required').exists(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { startDate, endDate } = req.body;
		const userId = req.user.id;

		const userData = await UserCaloriesModel.findOne({ where: userId, raw: true });
		const { avatar, email, username } = await UserModel.findByPk(userId, { raw: true });
		const consumedFood = await getUserConsumedFoodByDate({
			userId,
			startDate,
			endDate,
		});

		res.status(200).json({
			...userData,
			consumedFood: [...consumedFood],
			avatar,
			email,
			username,
		});
	}),
);

export default userDataController;
