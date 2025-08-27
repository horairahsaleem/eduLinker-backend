


import mongoose from "mongoose";

const schema = new mongoose.Schema({
  // Title: required, with min and max length validations
  title: {
    type: String,
    required: true,
    minLength: [6, "The Title must be 6 characters or more"],
    maxLength: [80, "The Title must be less than or equal to 80 characters"],
  },
  
  // Description: required, with minimum length validation
  description: {
    type: String,
    required: true,
    minLength: [20, "The Description must be 20 characters or more"],
  },
  
  // Lectures: array of objects, each containing title, description, and video info
  lectures: [
    {
      title: { 
        type: String, 
        required: true 
      },
      description: { 
        type: String, 
        required: true 
      },
      video:{
        public_id:{ 
          type: String, 
          required: true 
        },
        url: { 
          type: String, 
          required: true 
        },
      },
    },
  ],
  
  // Poster: required, containing public_id and url
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  
  // View count with default value
  views: {
    type: Number,
    default: 0,
  },
  
  // Number of videos with default value
  numOfVideos: {
    type: Number,
    default: 0,
  },
  
  // Category: required
  category: {
    type: String,
    required: true,
  },
  
  // CreatedBy: required, with a custom error message
  createdby: {
    type: String,
    required: [true, "Enter creator's name"],
  },
  
  // CreatedAt: automatically managed by timestamps option
}, { timestamps: true });  // This will automatically add createdAt and updatedAt fields

// Export the Course model
export const Course = mongoose.model('Course', schema);
