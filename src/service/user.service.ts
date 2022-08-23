import { DocumentDefinition, FilterQuery } from "mongoose";
import { omit } from "lodash";
import User, { IUser } from "../model/user.model";

//Inserting user data
export async function createUser(input: DocumentDefinition<IUser>) {
  try {
    return await User.create(input);
  } catch (error:any) {
    throw new Error(error);
  }
}
//Finding the user

export async function findUser(query: FilterQuery<IUser>) {
  return User.findOne(query).lean();
}

export async function validatePassword({
  email,
  password,
}: {
  email: IUser["email"];
  password: string;
}) {
  const user = await User.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) {
    return false;
  }

  return omit(user.toJSON(), "password");
}