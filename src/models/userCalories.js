import { Model } from 'sequelize';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class UserCaloriesModel extends Model {}

UserCaloriesModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
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
	},
	{
		sequelize: db,
		modelName: 'user_calories',
	},
);

UserCaloriesModel.belongsTo(UserModel, { foreignKey: 'userId' });
