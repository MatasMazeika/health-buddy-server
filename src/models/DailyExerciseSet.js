import { Model } from 'sequelize';
import { DailyExerciseModel } from './dailyExercise';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class DailyExerciseSetModel extends Model {}

DailyExerciseSetModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		set: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
		repetitions: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
		weight: {
			type: DataTypes.SMALLINT,
		},
		unit: {
			type: DataTypes.TEXT,
		},
	},
	{
		sequelize: db,
		modelName: 'daily_exercise_set',
	},
);

DailyExerciseSetModel.belongsTo(DailyExerciseModel, { foreignKey: 'dailyExerciseId' });
