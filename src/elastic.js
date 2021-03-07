import elasticsearch from 'elasticsearch';
import food from './food.json';
import { FoodModel } from './models/food';

export const esClient = elasticsearch.Client({
	host: 'http://host.docker.internal:9200',
});

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
	}
);

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
