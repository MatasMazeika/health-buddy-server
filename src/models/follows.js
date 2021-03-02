import { Model } from 'sequelize';
import { NewsfeedModel } from './newsFeed';
import { UserModel } from './user';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class FollowsModel extends Model {}

FollowsModel.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
	},
	{
		sequelize: db,
		modelName: 'follows',
	},
);

FollowsModel.belongsTo(UserModel, { foreignKey: 'followedUserId' });
FollowsModel.belongsTo(UserModel, { foreignKey: 'userId' });
