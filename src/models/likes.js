import { Model } from 'sequelize';
import { UserModel } from './user';
import { NewsfeedModel } from './newsFeed';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class LikesModel extends Model {}

LikesModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
	},
	{
		sequelize: db,
		modelName: 'likes',
	},
);

LikesModel.belongsTo(UserModel, { foreignKey: 'userId' });
LikesModel.belongsTo(NewsfeedModel, { foreignKey: 'postId' });
