import mongoose from 'mongoose';

const photoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Photo title is required'],
      trim: true,
      maxlength: [120, 'Photo title cannot exceed 120 characters']
    },
    category: {
      type: String,
      required: [true, 'Photo category is required'],
      trim: true,
      default: 'General'
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    imageUrl: {
      type: String,
      required: [true, 'Photo image URL is required'],
      trim: true
    },
    imagePublicId: {
      type: String,
      default: null,
      trim: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    order: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Indexes for categorization and sorting
photoSchema.index({ category: 1, featured: 1, order: 1, createdAt: -1 });

const Photo = mongoose.model('Photo', photoSchema);

export default Photo;
