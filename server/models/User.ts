import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^\d{10}$/, 'Please enter a valid 10-digit phone number'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false,
  },
  userType: {
    type: String,
    enum: {
      values: ['seller', 'customer'],
      message: '{VALUE} is not a valid user type',
    },
    required: [true, 'User type is required'],
  },
  profileImage: {
    type: String,
    default: '',
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  location: {
    city: String,
    state: String,
  },
  rating: {
    average: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 5,
    },
    count: { 
      type: Number, 
      default: 0,
      min: 0,
    },
  },
}, {
  timestamps: true,
})

// Indexes for performance
userSchema.index({ email: 1 })
userSchema.index({ userType: 1 })

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password)
  } catch (error) {
    return false
  }
}

// Export model
export const User = mongoose.models.User || mongoose.model('User', userSchema)
