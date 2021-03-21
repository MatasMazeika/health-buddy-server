import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userController from './controlers/userController';
import { applyPassportStrategy } from './middleware/passport';
import { UserModel } from './models/user';
import foodController from './controlers/foodController';
import consumedFoodController from './controlers/consumedFoodController';
import { FoodModel } from './models/food';
import { ConsumedFoodModel } from './models/consumedFood';
import { WorkoutModel } from './models/workout';
import { DailyExerciseModel } from './models/dailyExercise';
import userDataController from './controlers/userDataController';
import { UserCaloriesModel } from './models/userCalories';
import dailyExerciseController from './controlers/dailyExerciseController';
import { NewsfeedModel } from './models/newsFeed';
import { LikesModel } from './models/likes';
import { CommentsModel } from './models/comments';
import newsfeedController from './controlers/newsfeedController';
import { FollowsModel } from './models/follows';
import { MealFoodModel } from './models/mealFood';
import { MealModel } from './models/meals';
import mealsController from './controlers/mealsController';
import { DailyExerciseSetModel } from './models/DailyExerciseSet';
import food from './food.json';
import { initElastic } from './elastic';

require('dotenv').config();

const express = require('express');
const { db } = require('./db');

const app = express();
const port = 3000;

app.use(cors());

app.use(
	fileUpload({
		createParentPath: true,
	}),
);

applyPassportStrategy(passport);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/user', userController);
app.use(
	'/food',
	passport.authenticate('jwt', { session: false }),
	foodController,
);
app.use(
	'/consumed-food',
	passport.authenticate('jwt', { session: false }),
	consumedFoodController,
);
app.use(
	'/user-data',
	passport.authenticate('jwt', { session: false }),
	userDataController,
);
app.use(
	'/exercise',
	passport.authenticate('jwt', { session: false }),
	dailyExerciseController,
);

app.use(
	'/newsfeed',
	passport.authenticate('jwt', { session: false }),
	newsfeedController,
);

app.use(
	'/meals',
	passport.authenticate('jwt', { session: false }),
	mealsController,
);

const resetDb = async () => {
	await db.sync({ force: true });
	await UserModel.create({
		email: 'matas@matukas.com',
		password:
			'653def9360397209d2e47ec9b37f568a6a43010f96a8a2965509a79765b9939c',
		username: 'matukasklasi',
		avatar:
			'https://healthbuddyusesrimages.s3.eu-central-1.amazonaws.com/cordelia.jpg',
	});
	await UserModel.create({
		email: 'matas@john.com',
		password:
			'653def9360397209d2e47ec9b37f568a6a43010f96a8a2965509a79765b9939c',
		username: 'matukdsadklasi',
		avatar:
			'https://healthbuddyusesrimages.s3.eu-central-1.amazonaws.com/_114587591_gettyimages-676894393.jpg',
	});
	await UserCaloriesModel.create({
		carbs: 255,
		fat: 60,
		protein: 120,
		calories: 3200,
		userId: 1,
	});
	await FoodModel.create({
		name: 'Chicken',
		carbs: 5,
		fat: 0,
		protein: 12,
		calories: 12,
		unit: 'gram',
		amount: 100,
	});
	await FoodModel.create({
		name: 'Spinach',
		carbs: 15,
		fat: 0,
		protein: 0,
		calories: 50,
		unit: 'gram',
		amount: 100,
	});

	for (let i = 0; i < food.length; i += 1) {
		const {
			produktas: name,
			kal: calories,
			ang: carbs,
			rie: fat,
			bal: protein,
		} = food[i].Product;
		// eslint-disable-next-line no-await-in-loop
		await FoodModel.create({
			name,
			carbs,
			fat,
			calories,
			protein,
			unit: 'gram',
			amount: 100,
		});
	}

	await ConsumedFoodModel.create({
		userId: 1,
		foodId: 1,
		name: 'Chicken',
		carbs: 12,
		fat: 0,
		protein: 12,
		timeOfDay: 'breakfast',
		calories: 150,
		unit: 'gram',
		amount: 100,
	});
	await WorkoutModel.create({
		name: 'Upper body',
	});
	await DailyExerciseModel.create({
		name: 'Bench press',
		userId: 1,
	});
	await DailyExerciseSetModel.create({
		name: 'Bench press',
		set: 1,
		repetitions: 10,
		weight: 80,
		dailyExerciseId: 1,
	});
	await DailyExerciseSetModel.create({
		name: 'Bench press',
		set: 2,
		repetitions: 10,
		weight: 80,
		dailyExerciseId: 1,
	});
	await DailyExerciseSetModel.create({
		name: 'Bench press',
		workoutId: 1,
		set: 3,
		repetitions: 10,
		weight: 65,
		dailyExerciseId: 1,
	});
	await MealModel.create({
		userId: 1,
		mealName: 'Aligator chicken sandwich',
		totalCalories: 300,
		totalCarbs: 200,
		totalProtein: 150,
		totalFat: 200,
		totalAmount: 400,
	});
	await MealModel.create({
		userId: 1,
		mealName: 'Aligator turbo chicken sandwich',
		totalCalories: 300,
		totalCarbs: 200,
		totalProtein: 150,
		totalFat: 200,
		totalAmount: 500,
	});
	await MealFoodModel.create({
		foodId: 1,
		mealId: 1,
		name: 'Aligator meat',
		carbs: 21,
		fat: 16.8,
		protein: 70,
		calories: 100,
		unit: 'gram',
		amount: 150,
	});
	await MealFoodModel.create({
		foodId: 2,
		mealId: 1,
		name: 'Chicken',
		carbs: 7.5,
		fat: 0,
		protein: 25,
		calories: 0,
		unit: 'gram',
		amount: 50,
	});
	await MealFoodModel.create({
		foodId: 3,
		mealId: 1,
		name: 'Spinach',
		carbs: 7.5,
		fat: 0,
		protein: 18,
		calories: 18,
		unit: 'gram',
		amount: 140,
	});
	await MealFoodModel.create({
		foodId: 1,
		mealId: 2,
		name: 'Aligator meat turbo',
		carbs: 21,
		fat: 16.8,
		protein: 70,
		calories: 100,
		unit: 'gram',
		amount: 150,
	});
	await MealFoodModel.create({
		foodId: 2,
		mealId: 2,
		name: 'Chicken beat',
		carbs: 7.5,
		fat: 0,
		protein: 25,
		calories: 0,
		unit: 'gram',
		amount: 50,
	});
	await MealFoodModel.create({
		foodId: 3,
		mealId: 2,
		name: 'Spinach salad',
		carbs: 7.5,
		fat: 0,
		protein: 18,
		calories: 18,
		unit: 'gram',
		amount: 140,
	});
	await NewsfeedModel.create({
		userId: 1,
		mealId: 1,
		text: 'Look at my amazing progress WOW!',
	});
	await NewsfeedModel.create({
		userId: 2,
		mealId: 2,
		text: 'My posterino!',
	});
	await NewsfeedModel.create({
		userId: 2,
		text: 'This is the life!',
	});
	await LikesModel.create({
		postId: 1,
		userId: 1,
		type: 'like',
	});
	await LikesModel.create({
		postId: 1,
		userId: 2,
		type: 'like',
	});
	await LikesModel.create({
		postId: 2,
		userId: 1,
		type: 'like',
	});
	await LikesModel.create({
		postId: 2,
		userId: 2,
		type: 'like',
	});
	await LikesModel.create({
		postId: 3,
		userId: 1,
		type: 'like',
	});
	await LikesModel.create({
		postId: 3,
		userId: 2,
		type: 'like',
	});
	await CommentsModel.create({
		postId: 1,
		userId: 1,
		comment: "Wtf, you haven't made any progress scrub!",
	});
	await FollowsModel.create({
		followedUserId: 2,
		userId: 1,
	});
	await FollowsModel.create({
		followedUserId: 1,
		userId: 1,
	});
	await WorkoutModel.create({
		userId: 1,
		name: 'Chest and biceps',
	});
};

app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`);
	console.log('Example app');
	console.log('Example app 123');
	console.log('Example app 123');
	await db.authenticate();
});
