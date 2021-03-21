import elasticsearch from 'elasticsearch';
import food from './food.json';
import { FoodModel } from './models/food';
import { MealModel } from './models/meals';

export const esClient = elasticsearch.Client({
	host: 'http://172.17.0.1:9200',
});

const createFoodIndex = () => {
	esClient.indices.create(
		{
			index: 'food',
		},
		(error, response, status) => {
			if (error) {
				console.log(error);
			} else {
				console.log('created a new index', response);
			}
		},
	);
};

const createMealIndex = () => {
	esClient.indices.create(
		{
			index: 'meals',
		},
		(error, response, status) => {
			if (error) {
				console.log(error);
			} else {
				console.log('created a new index', response);
			}
		},
	);
};

const indexUserMeals = async () => {
	const allMeals = await MealModel.findAll({ raw: true });

	const bulk = [];
	allMeals.forEach((fod) => {
		bulk.push({
			index: {
				_index: 'meals',
				_type: 'meals-list',
			},
		});
		bulk.push(fod);
	});

	esClient.bulk({ body: bulk }, (err) => {
		if (err) {
			console.log('Failed Bulk operation'.red, err);
			console.log('Failed Bulk operation'.red, err);
			console.log('bad');
		} else {
			console.log('Successfully imported %s'.green, allMeals.length);
		}
	});
};

const indexAddedFoodToElastic = async () => {
	const allFood = await FoodModel.findAll({ raw: true });
	console.log(allFood);
	const bulk = [];
	allFood.forEach((fod) => {
		bulk.push({
			index: {
				_index: 'food',
				_type: 'food-list',
			},
		});
		bulk.push(fod);
	});

	esClient.bulk({ body: bulk }, (err) => {
		if (err) {
			console.log('Failed Bulk operation'.red, err);
			console.log('Failed Bulk operation'.red, err);
			console.log('bad');
		} else {
			console.log('Successfully imported %s'.green, food.length);
		}
	});
};

export const initElastic = () => {
	createMealIndex();
	createFoodIndex();
	indexUserMeals();
	indexAddedFoodToElastic();
};
