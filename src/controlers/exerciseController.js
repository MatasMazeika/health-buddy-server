import express from 'express';
import { body } from 'express-validator';
import { asyncWrap, checkValidation } from '../utils/common';
import { ExerciseModel } from '../models/exercise';
import consumedFoodController from './consumedFoodController';
import { getExercisesByDate } from '../modules/exerciseModule';

const exerciseController = express.Router();

consumedFoodController.get(
	'/',
	[
		body('startDate', 'Start date is required').isISO8601(),
		body('endDate', 'End date is required').isISO8601(),
	],
	asyncWrap(async (req, res) => {
		const { startDate, endDate } = req.body;
		const userId = req.user.id;

		const exercises = await getExercisesByDate({ userId, startDate, endDate });

		res.status(200).json(exercises);
	}),
);

/**
 * Add new exercise
 */
exerciseController.post(
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
		const { sets, name: reqName } = req.body;
		const userId = req.user.id;

		const addedExercises = await Promise.all(
			sets.map(async (exerciseSet) => ExerciseModel.create(
				{
					userId,
					name: reqName,
					...exerciseSet,
				},
				{ raw: true },
			)),
		);

		const exercisesWithIds = addedExercises.map((data) => {
			const {
				id, name, set, weight, unit, repetitions,
			} = data.get({
				plain: true,
			});

			return {
				id,
				name,
				set,
				weight,
				unit,
				repetitions,
			};
		});

		res.status(200).json({ name: reqName, sets: exercisesWithIds });
	}),
);

exerciseController.patch(
	'/',
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
			name, id, set, weight, unit, repetitions,
		} = req.body;

		const editedExercise = await ExerciseModel.update(
			{
				name,
				set,
				weight,
				repetitions,
				unit,
			},
			{ where: { id } },
		);

		console.log(editedExercise);

		res.status(200).json({
			name, id, set, weight, unit, repetitions,
		});
	}),
);

export default exerciseController;
