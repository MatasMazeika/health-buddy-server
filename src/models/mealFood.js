import { Model } from 'sequelize';
import { FoodModel } from './food';
import { MealModel } from './meals';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class MealFoodModel extends Model {}

MealFoodModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		carbs: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		fat: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		protein: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		calories: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
		unit: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		amount: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'meal_food',
	},
);

MealFoodModel.belongsTo(FoodModel, { foreignKey: 'foodId' });
MealFoodModel.belongsTo(MealModel, { foreignKey: 'mealId' });
