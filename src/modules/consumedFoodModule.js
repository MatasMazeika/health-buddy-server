import { Op } from 'sequelize';
import { ConsumedFoodModel } from '../models/consumedFood';

export const getUserConsumedFoodByDate = ({ userId, startDate, endDate }) => ConsumedFoodModel.findAll({
	where: {
		userId,
		createdAt: { [Op.between]: [startDate, endDate] },
	},
});
