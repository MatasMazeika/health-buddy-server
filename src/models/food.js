import { Model } from 'sequelize';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class FoodModel extends Model {}

FoodModel.init(
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
			type: DataTypes.CHAR,
			allowNull: false,
		},
		amount: {
			type: DataTypes.DOUBLE,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'food',
	},
);
