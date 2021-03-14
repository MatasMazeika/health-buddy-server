import express from 'express';
import passport from 'passport';
import { body, query } from 'express-validator';
import { Op } from 'sequelize';
import { ConsumedFoodModel } from '../models/consumedFood';
import { asyncWrap, checkValidation } from '../utils/common';
import { getUserConsumedFoodByDate } from '../modules/consumedFoodModule';

const consumedFoodController = express.Router();

/**
 * Get all consumed daily food, with daily calories
 */
consumedFoodController.get(
	'/',
	[
		query('startDate', 'Start date is required').exists(),
		query('endDate', 'End date is required').exists(),
	],
	asyncWrap(async (req, res) => {
		console.log(JSON.parse(JSON.stringify(req.query)));
		const { startDate, endDate } = req.query;
		const userId = req.user.id;

		const food = await getUserConsumedFoodByDate({
			userId,
			startDate: startDate.replace(/['"]+/g, ''),
			endDate: endDate.replace(/['"]+/g, ''),
		});
		const calories = food.reduce((acc, curr) => acc + curr.calories, 0);

		res.status(200).json({ consumedFood: food, calories });
	}),
);

/**
 * Delete consumed food by id
 */
consumedFoodController.delete(
	'/:id',
	asyncWrap(async (req, res) => {
		const { id } = req.params;

		await ConsumedFoodModel.destroy({ where: { id } });

		res.status(200).json({ msg: 'Deleted successfully' });
	}),
);

consumedFoodController.patch(
	'/:id',
	[
		body('carbs', 'Start date is required'),
		body('fat', 'End date is required'),
		body('protein', 'End date is required'),
		body('calories', 'End date is required'),
		body('unit', 'End date is required'),
		body('amount', 'End date is required'),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { id } = req.params;
		const {
			carbs, fat, protein, calories, unit, amount,
		} = req.body;

		const food = await ConsumedFoodModel.update(
			{
				carbs,
				fat,
				protein,
				calories,
				unit,
				amount,
			},
			{ where: { id } },
		);

		res.status(200).json(food);
	}),
);

consumedFoodController.delete(
	'/:id',
	asyncWrap(async (req, res) => {
		const { id } = req.params;

		await ConsumedFoodModel.destroy({ where: { id } });

		res.status(200).json({ msg: 'Deleted successfully' });
	}),
);

consumedFoodController.post(
	'/',
	[
		body('protein', 'Protein is required').trim().isNumeric(),
		body('carbs', 'Carbs is required').trim().isNumeric(),
		body('fat', 'Fat is required').trim().isNumeric(),
		body('calories', 'Calories is required').trim().isNumeric(),
		body('unit', 'Unit is required').trim().isString(),
		body('amount', 'Amount is required').trim().isNumeric(),
		body('foodId', 'Food id is required').exists(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const requestedFood = req.body;
		const userId = req.user.id;

		const food = await ConsumedFoodModel.create({
			...requestedFood,
			userId,
		});

		res.status(200).json({ food });
	}),
);

consumedFoodController.post(
	'/multiple',
	[
		body('foods.*.protein', 'Protein is required').trim().isNumeric(),
		body('foods.*.carbs', 'Carbs is required').trim().isNumeric(),
		body('foods.*.fat', 'Fat is required').trim().isNumeric(),
		body('foods.*.calories', 'Calories is required').trim().isNumeric(),
		body('foods.*.unit', 'Unit is required').trim().isString(),
		body('foods.*.amount', 'Amount is required').trim().isNumeric(),
		body('foods.*.foodId', 'Food id is required').exists(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { foods } = req.body;
		const userId = req.user.id;

		const addUserIdToConsumedFood = foods.map((food) => ({ ...food, userId }));

		const consumedFoods = await ConsumedFoodModel.bulkCreate(addUserIdToConsumedFood);

		res.status(200).json({ consumedFoods });
	}),
);

export default consumedFoodController;
