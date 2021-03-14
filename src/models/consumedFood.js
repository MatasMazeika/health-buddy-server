import { Model } from 'sequelize';
import { UserModel } from './user';
import { FoodModel } from './food';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class ConsumedFoodModel extends Model {}

ConsumedFoodModel.init(
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
		timeOfDay: {
			type: DataTypes.TEXT,
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
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'consumed_food',
	},
);

ConsumedFoodModel.belongsTo(UserModel, { foreignKey: 'userId' });
ConsumedFoodModel.belongsTo(FoodModel, { foreignKey: 'foodId' });
