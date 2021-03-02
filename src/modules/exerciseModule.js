import { Op } from 'sequelize';
import { ExerciseModel } from '../models/exercise';

export const getExercisesByDate = ({ userId, startDate, endDate }) => ExerciseModel.findAll({
	where: {
		userId,
		createdAt: { [Op.between]: [startDate, endDate] },
	},
});
