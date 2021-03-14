import roundTo from 'round-to';
import { asyncWrap } from '../utils/common';
import { MealModel } from '../models/meals';
import { MealFoodModel } from '../models/mealFood';
import { FoodModel } from '../models/food';
import { percentageToGet } from '../utils/percentage';
import { mapLithuanianChars } from '../utils/mapLithuanianChars';
import { esClient } from '../elastic';

export const indexAddedMealToElastic = asyncWrap(async (meal) => {
	await esClient.index({
		index: 'meals',
		body: meal,
	});
});

export const getUserMeals = asyncWrap(async (req, res) => {
	const { search: searchText } = req.query;
	const userId = req.user.id;

	const search = {
		size: 50,
		from: 0,
		query: {
			query_string: {
				query: `*${mapLithuanianChars(searchText)}* AND ${userId}`,
				fields: ['mealName', 'userId'],
				fuzziness: 'AUTO',
			},
		},
	};

	const allUserMeals = await esClient.search({
		index: 'meals',
		body: search,
		type: 'meals-list',
	});

	const allUserMealsIds = allUserMeals.hits.hits.map(
		(userMeal) => userMeal._source.id,
	);

	const userMealsWithFood = [];

	for (let i = 0; i < allUserMealsIds.length; i += 1) {
		// eslint-disable-next-line no-await-in-loop
		const allMealFoods = await MealFoodModel.findAll({
			where: { mealId: allUserMeals.hits.hits[i]._source.id },
			raw: true,
		});

		userMealsWithFood.push({
			...allUserMeals.hits.hits[i]._source,
			mealFoods: allMealFoods,
		});
	}

	res.status(200).json({ meals: userMealsWithFood });
});

export const createMeal = asyncWrap(async (req, res) => {
	const {
		mealName,
		mealFoods,
		totalCarbs,
		totalProtein,
		totalAmount,
		totalFat,
		totalCalories,
	} = req.body;
	const userId = req.user.id;

	const createdMeal = (
		await MealModel.create({
			mealName,
			userId,
			totalCarbs,
			totalProtein,
			totalAmount,
			totalFat,
			totalCalories,
		})
	).toJSON();

	await indexAddedMealToElastic(createdMeal);

	const mealFoodsToAdd = mealFoods.map((mealFood) => ({
		...mealFood,
		mealId: createdMeal.id,
	}));
	const createdMealFoods = await MealFoodModel.bulkCreate(mealFoodsToAdd);

	res.status(200).json({ meassage: 'created' });
});
