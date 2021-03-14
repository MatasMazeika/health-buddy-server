import { Model } from 'sequelize';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class DailyExerciseModel extends Model {}

DailyExerciseModel.init(
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
	},
	{
		sequelize: db,
		modelName: 'daily_exercise',
	},
);

DailyExerciseModel.belongsTo(UserModel, { foreignKey: 'userId' });
