import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
      maxlength: [120, 'Project title cannot exceed 120 characters']
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true
    },
    tags: {
      type: [String],
      default: []
    },
    githubUrl: {
      type: String,
      trim: true,
      default: null
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: null
    },
    imageUrl: {
      type: String,
      required: [true, 'Project image URL is required'],
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

// Index for performant ordering and featured queries
projectSchema.index({ featured: 1, order: 1, createdAt: -1 });

const Project = mongoose.model('Project', projectSchema);

export default Project;
