import roundTo from 'round-to';
import { asyncWrap } from '../utils/common';
import { MealModel } from '../models/meals';
import { MealFoodModel } from '../models/mealFood';
import { FoodModel } from '../models/food';
import { percentageToGet } from '../utils/percentage';

export const getAllUserMeals = asyncWrap(async (req, res) => {
	const userId = req.user.id;

	const allUserMeals = await MealModel.findAll({
		where: { userId },
		raw: true,
	});

	const allUserMealsIds = allUserMeals.map((userMeal) => userMeal.id);

	const allMealFoods = await MealFoodModel.findAll({
		where: { mealId: allUserMealsIds },
		raw: true,
	});

	const allMealFoodsIds = allMealFoods.map((mealFood) => mealFood.foodId);

	const allFoods = await FoodModel.findAll({
		where: { id: allMealFoodsIds },
		raw: true,
	});

	const mealWithFood = allUserMeals.reduce((acc, curr) => {
		const mealFood = allMealFoods.filter((mealFood) => mealFood.mealId === curr.id) || [];
		const [food, total] = mealFood.reduce(
			([newFoods, total], currMealFood) => {
				const foodData = allFoods.find(
					(_food) => _food.id === currMealFood.foodId,
				);
				const carbs = roundTo(
					percentageToGet(1, foodData.carbs) * currMealFood.amount,
					2,
				);
				const protein = roundTo(
					percentageToGet(1, foodData.protein) * currMealFood.amount,
					2,
				);
				const fat = roundTo(
					percentageToGet(1, foodData.fat) * currMealFood.amount,
					2,
				);
				const calories = roundTo(
					percentageToGet(1, foodData.calories) * currMealFood.amount,
					2,
				);
				const totalCalories = total.totalCalories + calories;
				const totalProtein = total.totalProtein + protein;
				const totalFat = total.totalFat + fat;
				const totalCarbs = total.totalCarbs + carbs;
				const totalAmount = total.totalAmount + currMealFood.amount;

				return [
					[
						...newFoods,
						{
							name: foodData.name,
							carbs,
							fat,
							calories,
							protein,
							amount: currMealFood.amount,
						},
					],
					{
						totalCarbs,
						totalProtein,
						totalFat,
						totalCalories,
						totalAmount,
					},
				];
			},
			[
				[],
				{
					totalCarbs: 0,
					totalProtein: 0,
					totalFat: 0,
					totalCalories: 0,
					totalAmount: 0,
				},
			],
		);

		return [
			...acc,
			{
				...curr,
				...total,
				mealFoods: food,
			},
		];
	}, []);

	res.status(200).json({ meals: mealWithFood });
});

export const createMeal = asyncWrap(async (req, res) => {
	const { mealName, mealFoods } = req.body;
	const userId = req.user.id;

	const createdMeal = (
		await MealModel.create({
			mealName,
			userId,
		})
	).toJSON();
	const mealFoodsToAdd = mealFoods.map((mealFood) => ({
		amount: mealFood.amount,
		unit: mealFood.unit,
		foodId: mealFood.id,
		mealId: createdMeal.id,
	}));
	const createdMealFoods = await MealFoodModel.bulkCreate(mealFoodsToAdd);

	res.status(200).json({ meassage: 'created' });
});
