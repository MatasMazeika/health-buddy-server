import express from 'express';
import passport from 'passport';
import { body } from 'express-validator';
import { FoodModel } from '../models/food';
import { asyncWrap, checkValidation } from '../utils/common';
import { createMeal, getUserMeals } from '../modules/mealsModule';

const mealsController = express.Router();

/**
 * Get all user meals
 */
mealsController.get('/', [checkValidation, getUserMeals]);

mealsController.post('/', [checkValidation, createMeal]);

export default mealsController;
