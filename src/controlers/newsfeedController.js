import express from 'express';
import { body } from 'express-validator';
import { checkValidation } from '../utils/common';
import {
	addComment,
	addPost, deleteComment, editComment, editPost, getFollowedUsersPosts, likePost, unlikePost,
} from '../modules/newsfeedModule';

const newsfeedController = express.Router();

const postValidation = [
	body('text')
		.exists()
		.withMessage('Post ir required')
		.isString()
		.withMessage('Has to be a string')
		.isLength({ max: 255 })
		.withMessage('Length cannot be more than 255'),
	checkValidation,
];

const commentValidation = [
	body('comment')
		.exists()
		.withMessage('Comment is required')
		.isString()
		.withMessage('Has to be a string')
		.isLength({ max: 255 })
		.withMessage('Length cannot be more than 255'),
	checkValidation,
];

newsfeedController.get('/', (req, res) => {
	getFollowedUsersPosts(req, res);
});

newsfeedController.post('/', [
	postValidation,
	addPost,
]);

newsfeedController.patch('/', postValidation, (req, res) => {
	editPost(req, res);
});

newsfeedController.post('/like', (req, res) => {
	likePost(req, res);
});

newsfeedController.delete('/like', (req, res) => {
	unlikePost(req, res);
});

newsfeedController.post('/comment', [
	commentValidation,
	addComment,
]);

newsfeedController.patch('/comment', [
	commentValidation,
	editComment,
]);

newsfeedController.delete('/comment', [
	commentValidation,
	deleteComment,
]);

export default newsfeedController;
