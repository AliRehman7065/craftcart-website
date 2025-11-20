import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required'],
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['handicrafts', 'textiles', 'pottery', 'jewelry', 'home-decor', 'paintings', 'woodwork', 'metalwork', 'other'],
      message: '{VALUE} is not a valid category',
    },
  },
  images: [{
    type: String,
    required: true,
  }],
  stock: {
    type: Number,
    default: 1,
    min: [0, 'Stock cannot be negative'],
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
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
})

// Indexes for performance
productSchema.index({ sellerId: 1 })
productSchema.index({ category: 1 })
productSchema.index({ price: 1 })
productSchema.index({ 'rating.average': -1 })
productSchema.index({ isActive: 1 })
productSchema.index({ title: 'text', description: 'text' })

// Validation: Ensure at least one image
productSchema.pre('validate', function(next) {
  if (!this.images || this.images.length === 0) {
    this.invalidate('images', 'At least one image is required')
  }
  next()
})

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema)
