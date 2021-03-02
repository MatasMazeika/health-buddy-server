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
			unique: true,
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
			type: DataTypes.CHAR,
			allowNull: false,
		},
		amount: {
			type: DataTypes.SMALLINT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'food',
	},
);
