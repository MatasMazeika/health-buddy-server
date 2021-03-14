import { Op } from 'sequelize';
import { DailyExerciseModel } from '../models/dailyExercise';
import { asyncWrap } from '../utils/common';
import { DailyExerciseSetModel } from '../models/DailyExerciseSet';

export const getDailyExercisesByDate = async ({
	userId,
	startDate,
	endDate,
}) => {
	const dailyExercises = await DailyExerciseModel.findAll({
		where: {
			userId,
			createdAt: { [Op.between]: [startDate, endDate] },
		},
		raw: true,
	});
	const dailyExercisesIds = dailyExercises.map((exercise) => exercise.id);
	const dailyExerciseSets = await DailyExerciseSetModel.findAll({
		where: { dailyExerciseId: dailyExercisesIds },
		raw: true,
	});

	return dailyExercises.map((exercise) => ({
		...exercise,
		sets: dailyExerciseSets.filter((set) => set.dailyExerciseId === exercise.id),
	}));
};

export const getDailyExercises = asyncWrap(async (req, res) => {
	const { startDate, endDate } = req.body;
	const userId = req.user.id;

	const dailyExercises = await getDailyExercisesByDate({
		userId,
		startDate,
		endDate,
	});

	console.log(dailyExercises);

	res.status(200).json({ dailyExercises });
});
