import { Model } from 'sequelize';
import { UserModel } from './user';
import { MealModel } from './meals';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class NewsfeedModel extends Model {}

NewsfeedModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		text: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'news_feed',
	},
);

NewsfeedModel.belongsTo(UserModel, { foreignKey: 'userId' });
NewsfeedModel.belongsTo(MealModel, { foreignKey: 'mealId' });
