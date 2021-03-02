import { Model } from 'sequelize';
import { WorkoutModel } from './workout';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class ExerciseModel extends Model {}

ExerciseModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: false,
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
		modelName: 'exercise',
	},
);

ExerciseModel.belongsTo(WorkoutModel, { foreignKey: 'workoutId' });
