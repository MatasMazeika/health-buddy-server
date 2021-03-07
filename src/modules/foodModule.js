import { asyncWrap } from '../utils/common';
import { esClient } from '../elastic';

export const indexAddedFoodToElastic = asyncWrap(async (food) => {
	await esClient.index({
		index: 'food',
		body: food,
	});
});
