import express from 'express';
import { body } from 'express-validator';
import { asyncWrap, checkValidation } from '../utils/common';
import { DailyExerciseModel } from '../models/dailyExercise';
import { getDailyExercises } from '../modules/exerciseModule';
import { DailyExerciseSetModel } from '../models/DailyExerciseSet';

const dailyExerciseController = express.Router();

dailyExerciseController.get('/', [
	body('startDate', 'Start date is required').isISO8601(),
	body('endDate', 'End date is required').isISO8601(),
	checkValidation,
	getDailyExercises,
]);

/**
 * Add new exercise
 */
dailyExerciseController.post(
	'/',
	[
		body('name', 'Name is required').exists(),
		body('sets', 'Exercise is required').exists(),
		body('sets.*.set', 'Set is required').isNumeric(),
		body('sets.*.repetitions', 'Repetitions is required').isInt(),
		body('sets.*.weight', 'Weight is required').exists().isInt(),
		body('sets.*.unit', 'Unit is required').exists().isString(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { sets, name } = req.body;
		const userId = req.user.id;

		const createdExercise = (
			await DailyExerciseModel.create({ name, userId })
		).toJSON();

		const setsToCreate = sets.map((set) => ({
			...set,
			dailyExerciseId: createdExercise.id,
		}));

		const createdSets = await DailyExerciseSetModel.bulkCreate(setsToCreate, {
			raw: true,
		});

		res.status(200).json({ sets: createdSets, ...createdExercise });
	}),
);

dailyExerciseController.patch(
	'/',
	[
		body('name', 'Name is required').exists(),
		body('sets', 'Exercise is required').exists(),
		body('sets.*.set', 'Set is required').isNumeric(),
		body('sets.*.repetitions', 'Repetitions is required').isInt(),
		body('sets.*.weight', 'Weight is required').exists().isInt(),
		body('sets.*.unit', 'Unit is required').exists().isString(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const { sets, name, id } = req.body;

		const createdExercise = await DailyExerciseModel.update(
			{ name },
			{ where: { id }, returning: ['name'] },
		);
		const setsToCreate = sets.map((set) => ({
			...set,
			dailyExerciseId: id,
		}));

		const createdSets = await DailyExerciseSetModel.bulkCreate(setsToCreate, {
			raw: true,
		});

		res.status(200).json({ sets: createdSets, ...createdExercise });
	}),
);

dailyExerciseController.patch(
	'/set',
	[
		body('id', 'Id is required').exists(),
		body('name', 'Name is required').exists(),
		body('repetitions', 'Repetitions is required').exists(),
		body('set', 'Set is required').exists(),
		body('unit', 'Unit is required').exists(),
		body('weight', 'Weight is required').exists(),
		checkValidation,
	],
	asyncWrap(async (req, res) => {
		const {
			id, set, weight, unit, repetitions,
		} = req.body;

		const editedExercise = await DailyExerciseSetModel.update(
			{
				set,
				weight,
				repetitions,
				unit,
			},
			{ where: { id } },
		);

		console.log(editedExercise);

		res.status(200).json({
			id,
			set,
			weight,
			unit,
			repetitions,
		});
	}),
);

export default dailyExerciseController;
