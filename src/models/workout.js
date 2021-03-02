import { Model } from 'sequelize';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class WorkoutModel extends Model {}

WorkoutModel.init(
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
		modelName: 'workout',
	},
);

WorkoutModel.belongsTo(UserModel, { foreignKey: 'userId', foreignKeyConstraint: true });
