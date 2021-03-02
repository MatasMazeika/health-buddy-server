import cors from 'cors';
import passport from 'passport';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
import userController from './src/controlers/userController';
import { applyPassportStrategy } from './src/middleware/passport';
import { UserModel } from './src/models/user';
import foodController from './src/controlers/foodController';
import consumedFoodController from './src/controlers/consumedFoodController';
import { FoodModel } from './src/models/food';
import { ConsumedFoodModel } from './src/models/consumedFood';
import { WorkoutModel } from './src/models/workout';
import { ExerciseModel } from './src/models/exercise';
import userDataController from './src/controlers/userDataController';
import { UserCaloriesModel } from './src/models/userCalories';
import exerciseController from './src/controlers/exerciseController';
import { NewsfeedModel } from './src/models/newsFeed';
import { LikesModel } from './src/models/likes';
import { CommentsModel } from './src/models/comments';
import newsfeedController from './src/controlers/newsfeedController';
import { FollowsModel } from './src/models/follows';

require('dotenv').config();

const express = require('express');
const { db } = require('./src/db');

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
	exerciseController,
);

app.use(
	'/newsfeed',
	passport.authenticate('jwt', { session: false }),
	newsfeedController,
);

app.listen(port, async () => {
	console.log(`Example app listening at http://localhost:${port}`);
	await db.authenticate();

	await db.sync({ force: true });
	await UserModel.create({
		email: 'matas@matukas.com',
		password:
			'653def9360397209d2e47ec9b37f568a6a43010f96a8a2965509a79765b9939c',
		username: 'matukasklasi',
		avatar: 'https://healthbuddyusesrimages.s3.eu-central-1.amazonaws.com/cordelia.jpg',
	});
	await UserModel.create({
		email: 'matas@john.com',
		password:
			'653def9360397209d2e47ec9b37f568a6a43010f96a8a2965509a79765b9939c',
		username: 'matukdsadklasi',
		avatar: 'https://healthbuddyusesrimages.s3.eu-central-1.amazonaws.com/_114587591_gettyimages-676894393.jpg',
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
	await ExerciseModel.create({
		name: 'Bench press',
		workoutId: 1,
		set: 1,
		repetitions: 10,
		weight: 80,
	});
	await ExerciseModel.create({
		name: 'Pull ups',
		workoutId: 1,
		set: 1,
		repetitions: 10,
		weight: 80,
	});
	await NewsfeedModel.create({
		userId: 1,
		text: 'Look at my amazing progress WOW!',
	});
	await NewsfeedModel.create({
		userId: 2,
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
});
