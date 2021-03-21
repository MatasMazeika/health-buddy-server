import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { FoodModel } from '../models/food';
import { asyncWrap, checkValidation } from '../utils/common';
import { indexAddedFoodToElastic } from '../modules/foodModule';
import { esClient } from '../elastic';
import { mapLithuanianChars } from '../utils/mapLithuanianChars';

const foodController = express.Router();

/**
 * Get all foods in the DB
 */
foodController.get(
	'/',
	asyncWrap(async (req, res) => {
		const { search: searchText } = req.query;

		const search = {
			size: 50,
			from: 0,
			query: {
				query_string: {
					query: `*${mapLithuanianChars(searchText)}*`,
					fields: ['name'],
					fuzziness: 'AUTO',
				},
			},
		};

		const results = await esClient.search({
			index: 'food',
			body: search,
			type: 'food-list',
		});

		res.status(200).json({ results });
	}),
);

foodController.post(
	'/',
	[
		body('name', 'Food name is required')
			.trim()
			.isString()
			.isLength({ max: 255 }),
		body('protein', 'Protein is required').trim().isNumeric(),
		body('carbs', 'Carbs is required').trim().isNumeric(),
		body('fat', 'Fat is required').trim().isNumeric(),
		body('calories', 'Calories are required').trim().isNumeric(),
		body('amount', 'Amount is required').trim().isNumeric(),
		body('unit', 'Unit is required').trim().isString(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const requestedFood = req.body;

		const food = await FoodModel.create(requestedFood);
		await indexAddedFoodToElastic(food);

		res.status(200).json({ food });
	}),
);

export default foodController;
