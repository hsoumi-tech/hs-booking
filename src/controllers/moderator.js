import Moderator from '../models/moderator';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export const signin = async ({
  name,
  password
}) => {
  const moderator = await Moderator.findOne({
    name
  });
  if (moderator) {
    const isPasswordGood = bcrypt.compareSync(password, moderator.password);
    if (isPasswordGood) {
      return {
        code: 200,
        moderator
      };
    }
    return {
      code: 404,
      message: 'You have entered an invalid password'
    };
  }
  return {
    code: 404,
    message: 'You have entered an invalid email'
  };
};

export const addModerator = async ({
  name,
  password
}) => {
  // Check if email is already used by another account
  const nameModerator = await Moderator.findOne({
    name
  });
  if (nameModerator) {
    return {
      code: 409,
      message: 'name already in use'
    };
  }

  const newModerator = new Moderator({
    name,
    password: bcrypt.hashSync(password, 10)
  });
  return (await newModerator.save()).toJSON();
};