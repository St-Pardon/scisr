import { Schema, model, Types } from 'mongoose';
import bcrypt from 'bcrypt';
import { IUser } from '../utils/types.utils';

// Define user schema
const userSchema: Schema<IUser> = new Schema<IUser>({
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
  },
  provider: {
    type: String,
  },
  provider_id: {
    type: String,
  },
});

// ensure password is encrypted
userSchema.pre('save', async function (next) {
  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;
  next();
});

// password validation for log in
userSchema.methods.isValidPassword = async function (password: string): Promise<boolean> {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);

  return compare;
};

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

// Create user model from schema
const User = model<IUser>('User', userSchema);

export default User;
