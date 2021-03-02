import { Model } from 'sequelize';
import { NewsfeedModel } from './newsFeed';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class CommentsModel extends Model {}

CommentsModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		comment: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
	},
	{
		sequelize: db,
		modelName: 'comments',
	},
);

CommentsModel.belongsTo(NewsfeedModel, { foreignKey: 'postId' });
CommentsModel.belongsTo(UserModel, { foreignKey: 'userId' });
