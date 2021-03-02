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
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
		fat: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
		protein: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
		calories: {
			type: DataTypes.SMALLINT,
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
		modelName: 'consumed_food',
	},
);

ConsumedFoodModel.belongsTo(UserModel, { foreignKey: 'userId' });
ConsumedFoodModel.belongsTo(FoodModel, { foreignKey: 'foodId' });
