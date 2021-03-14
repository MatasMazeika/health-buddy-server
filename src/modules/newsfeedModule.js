import { DateTime } from 'luxon';

import { asyncWrap } from '../utils/common';
import { NewsfeedModel } from '../models/newsFeed';
import { FollowsModel } from '../models/follows';
import { UserModel } from '../models/user';
import { LikesModel } from '../models/likes';
import { getCreatedAgoTimeValue } from '../utils/getCreatedAgoDateKeyValue';
import { CommentsModel } from '../models/comments';
import { createdAt } from '../utils/commonModelTypes';
import { MealModel } from '../models/meals';
import { MealFoodModel } from '../models/mealFood';

export const getFollowedUsersPosts = asyncWrap(async (req, res) => {
	const userId = req.user.id;

	const followedUsersIds = (
		await FollowsModel.findAll({
			where: { userId },
			raw: true,
			attributes: ['id'],
		})
	).map((follow) => follow.id);

	const followedPosts = await NewsfeedModel.findAll({
		where: { userId: followedUsersIds },
		include: [
			{
				model: UserModel,
				attributes: ['username', 'avatar'],
			},
		],
		attributes: [
			'id',
			'text',
			'user.username',
			'user.avatar',
			'createdAt',
			'mealId',
		],
		order: [['createdAt', 'DESC']],
	});
	const followedPostIds = followedPosts.map((followedPost) => followedPost.id);
	const followedPostMealIds = followedPosts
		.filter((followedPost) => followedPost.mealId)
		.map((followedPost) => followedPost.mealId);

	const postLikes = await LikesModel.findAll({
		where: { postId: followedPostIds },
		include: [
			{
				model: UserModel,
				attributes: ['username'],
			},
		],
		attributes: ['user.username', 'postId'],
		raw: true,
	});

	const postComments = await CommentsModel.findAll({
		where: { postId: followedPostIds },
		include: [
			{
				model: UserModel,
				attributes: ['username'],
			},
		],
		attributes: [
			'user.username',
			'postId',
			'user.avatar',
			'comment',
			'createdAt',
		],
		raw: true,
	});

	const postMeals = await MealFoodModel.findAll({
		include: [
			{
				model: MealModel,
				attributes: [
					'mealName',
					'id',
					'totalCarbs',
					'totalProtein',
					'totalFat',
					'totalCalories',
				],
			},
		],
		where: {
			mealId: followedPostMealIds,
		},
		attributes: [
			'foodId',
			'amount',
			'unit',
			'carbs',
			'calories',
			'fat',
			'protein',
			'name',
		],
		raw: true,
	});
	console.log(postMeals);

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

	const addPostDataToPosts = followedPosts.reduce((acc, curr) => {
		const allPostLikes = postLikes.filter(
			(like) => like && like.postId === curr.id,
		);
		const allPostComments = postCommentsWithCreatedAgo.filter(
			(comment) => comment && comment.postId === curr.id,
		);
		const postMeal = postMeals.filter(
			(meal) => meal['meal.id'] === curr.mealId,
		);
		const constructPostMealResponse = postMeal.reduce(
			(newPostMeal, meal) => ({
				mealName: meal['meal.mealName'],
				totalCalories: meal['meal.totalCalories'],
				totalCarbs: meal['meal.totalCarbs'],
				totalProtein: meal['meal.totalProtein'],
				totalFat: meal['meal.totalFat'],
				totalAmount: meal['meal.totalAmount'],
				mealFoods: [
					...newPostMeal.mealFoods,
					{
						foodId: meal.foodId,
						amount: meal.amount,
						unit: meal.unit,
						carbs: meal.carbs,
						calories: meal.calories,
						fat: meal.fat,
						protein: meal.protein,
						name: meal.name,
					},
				],
			}),
			{ mealFoods: [] },
		);

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
				meal: constructPostMealResponse,
			},
		];
	}, []);

	res.status(200).json(addPostDataToPosts);
});

export const addPost = asyncWrap(async (req, res) => {
	const userId = req.user.id;
	const { text, mealId } = req.body;

	const createPost = (
		await NewsfeedModel.create({
			text,
			userId,
			mealId,
		})
	).toJSON();

	const addedMeal = await MealFoodModel.findAll({
		include: [
			{
				model: MealModel,
				where: { id: mealId },
			},
		],
		where: { mealId },
		raw: true,
	});

	const constructPostMealResponse = addedMeal.reduce(
		(newPostMeal, meal) => ({
			mealName: meal['meal.mealName'],
			totalCalories: meal['meal.totalCalories'],
			totalCarbs: meal['meal.totalCarbs'],
			totalProtein: meal['meal.totalProtein'],
			totalFat: meal['meal.totalFat'],
			totalAmount: meal['meal.totalAmount'],
			mealFoods: [
				...newPostMeal.mealFoods,
				{
					foodId: meal.foodId,
					amount: meal.amount,
					unit: meal.unit,
					carbs: meal.carbs,
					calories: meal.calories,
					fat: meal.fat,
					protein: meal.protein,
					name: meal.name,
				},
			],
		}),
		{ mealFoods: [] },
	);

	res.status(200).json({
		text: createPost.text,
		id: createPost.id,
		likes: [],
		comments: [],
		meal: constructPostMealResponse,
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

	await CommentsModel.update(
		{
			comment,
		},
		{ where: { id: commentId, userId } },
	);

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
