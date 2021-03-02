import { Model } from 'sequelize';
import sha256 from 'sha256';
import { createdAt, updatedAt } from '../utils/commonModelTypes';

const { DataTypes } = require('sequelize');
const { db } = require('../db');

export class UserModel extends Model {
	comparePassword(password) {
		return this.password === sha256(password);
	}
}

UserModel.init({
	username: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	avatar: {
		type: DataTypes.TEXT,
		allowNull: true,
	},
}, {
	sequelize: db,
	modelName: 'users',
});
