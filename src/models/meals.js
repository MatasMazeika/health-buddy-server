import { Model } from 'sequelize';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class MealModel extends Model {}

MealModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		mealName: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		totalCalories: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		totalCarbs: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		totalProtein: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		totalFat: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		totalAmount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'meals',
	},
);

MealModel.belongsTo(UserModel, { foreignKey: 'userId' });
