import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { FoodModel } from '../models/food';
import { asyncWrap, checkValidation } from '../utils/common';

const foodController = express.Router();

/**
 * Get all foods in the DB
 */
foodController.get('/', [
	passport.authenticate('jwt', { session: false }),
],
asyncWrap(async (req, res) => {
	const food = await FoodModel.findAll();
	res.status(200).json({ food });
}));

foodController.post(
	'/', [
		passport.authenticate('jwt', { session: false }),
		body('name', 'Food name is required').trim().isString().isLength({ max: 255 }),
		body('protein', 'Protein is required').trim().isNumeric(),
		body('carbs', 'Carbs is required').trim().isNumeric(),
		body('fat', 'Fat is required').trim().isNumeric(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const requestedFood = req.body;

		const food = await FoodModel.create(requestedFood);

		res.status(200).json({ food });
	}),
);

export default foodController;
