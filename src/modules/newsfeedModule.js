import { DateTime } from 'luxon';

import { asyncWrap } from '../utils/common';
import { NewsfeedModel } from '../models/newsFeed';
import { FollowsModel } from '../models/follows';
import { UserModel } from '../models/user';
import { LikesModel } from '../models/likes';
import { getCreatedAgoTimeValue } from '../utils/getCreatedAgoDateKeyValue';
import { CommentsModel } from '../models/comments';
import { createdAt } from '../utils/commonModelTypes';

export const getFollowedUsersPosts = asyncWrap(async (req, res) => {
	const userId = req.user.id;

	const followedUsersIds = await FollowsModel.findAll({
		where: { userId },
		raw: true,
	});

	const followedPosts = (await Promise.all(
		followedUsersIds.map((follow) => NewsfeedModel.findAll({
			include: [
				{
					model: UserModel,
					attributes: ['username', 'avatar'],
				},
			],
			where: { userId: follow.followedUserId },
			raw: true,
			attributes: ['id', 'text', 'user.username', 'user.avatar', 'createdAt'],
			order: [['createdAt', 'DESC']],
		})),
	)).flat();

	const postLikes = (await Promise.all(
		followedPosts.map(async (post) => LikesModel.findAll({
			include: [
				{
					model: UserModel,
					attributes: ['username'],
				},
			],
			attributes: ['user.username', 'postId'],
			where: { postId: post.id },
			raw: true,
		})),
	)).flat();

	const postComments = (await Promise.all(
		followedPosts.map(async (post) => CommentsModel.findAll({
			include: [
				{
					model: UserModel,
					attributes: ['username'],
				},
			],
			attributes: ['user.username', 'postId', 'user.avatar', 'comment', 'createdAt'],
			where: { postId: post.id },
			raw: true,
		})),
	)).flat();

	const postCommentsWithCreatedAgo = postComments.map((comment) => {
		const constCreatedTime = DateTime.fromJSDate(comment.createdAt);
		const timeNow = DateTime.now();
		const diffInMonths = timeNow
			.diff(constCreatedTime, [
				'years',
				'months',
				'days',
				'hours',
				'minutes',
				'seconds',
			])
			.toObject();

		return {
			...comment,
			createdAgo: getCreatedAgoTimeValue(diffInMonths),
			createdAt: DateTime.fromJSDate(comment.createdAt, 'DD/MM/YYYY h:mm:ss'),
		};
	});

	const addLikesToPost = followedPosts.reduce((acc, curr) => {
		const allPostLikes = postLikes.filter((like) => like && like.postId === curr.id);
		const allPostComments = postCommentsWithCreatedAgo
			.filter((comment) => comment && comment.postId === curr.id);

		const constCreatedTime = DateTime.fromJSDate(curr.createdAt);
		const timeNow = DateTime.now();
		const diffInMonths = timeNow
			.diff(constCreatedTime, [
				'years',
				'months',
				'days',
				'hours',
				'minutes',
				'seconds',
			])
			.toObject();

		return [
			...acc,
			{
				id: curr.id,
				text: curr.text,
				username: curr.username,
				avatar: curr.avatar,
				createdAt: DateTime.fromJSDate(curr.createdAt, 'DD/MM/YYYY h:mm:ss'),
				createdAgo: getCreatedAgoTimeValue(diffInMonths),
				likes: allPostLikes || [],
				comments: allPostComments || [],
			},
		];
	}, []);

	res.status(200).json(addLikesToPost);
});

export const addPost = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { text } = req.body;

	const createPost = (await NewsfeedModel.create(
		{
			text,
			userId,
		},
	)).toJSON();

	res.status(200).json({
		text: createPost.text,
		id: createPost.id,
		likes: [],
		createdAgo: { seconds: 'now' },
	});
});

export const editPost = asyncWrap(async (req, res) => {
	const { text, id } = req.body;

	await NewsfeedModel.update(
		{
			text,
		},
		{ where: { id } },
	);

	res.status(200).json({ msg: 'ok' });
});

export const likePost = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { postId } = req.body;

	await LikesModel.create({
		userId,
		postId,
	});

	res.status(200).json({ msg: 'ok' });
});

export const unlikePost = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { postId } = req.body;

	await LikesModel.destroy({
		where: { postId, userId },
	});

	res.status(200).json({ msg: 'ok' });
});

export const addComment = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { postId, comment } = req.body;

	await CommentsModel.create({
		userId,
		postId,
		comment,
	});

	res.status(200).json({ msg: 'ok' });
});

export const editComment = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { commentId, comment } = req.body;

	await CommentsModel.update({
		comment,
	}, { where: { id: commentId, userId } });

	res.status(200).json({ msg: 'ok' });
});

export const deleteComment = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { commentId } = req.body;

	await LikesModel.destroy({
		where: { id: commentId, userId },
	});

	res.status(200).json({ msg: 'ok' });
});
