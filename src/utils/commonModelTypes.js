import { DateTime } from 'luxon';
import { DataTypes } from 'sequelize';

export const createdAt = {
	type: DataTypes.DATE,
	get() {
		return DateTime(this.getDataValue('createdAt')).format('DD/MM/YYYY h:mm:ss');
	},
};

export const updatedAt = {
	type: DataTypes.DATE,
	get() {
		return DateTime(this.getDataValue('updatedAt')).format('DD/MM/YYYY h:mm:ss');
	},
};
