const AWS = require('aws-sdk');

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_API_KEY,
});

export const uploadFile = (params) => s3.upload(params).promise();
