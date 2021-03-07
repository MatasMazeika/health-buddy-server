import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { FoodModel } from '../models/food';
import { asyncWrap, checkValidation } from '../utils/common';
import { createMeal, getAllUserMeals } from '../modules/mealsModule';

const mealsController = express.Router();

/**
 * Get all user meals
 */
mealsController.get('/', [checkValidation, getAllUserMeals]);

mealsController.post('/', [checkValidation, createMeal]);

export default mealsController;
