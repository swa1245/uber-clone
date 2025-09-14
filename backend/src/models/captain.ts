import mongoose from "mongoose";    

const captainScheam = new mongoose.Schema({
    fullName: {
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
        },
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
        select: false,
      },socketId: {
        type: String,
      },
      status: {
        type: String,
        enum: [ 'active', 'inactive' ],
        default: 'inactive',
    },
    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [ 3, 'Color must be at least 3 characters long' ],
        },
        plate: {
            type: String,
            required: true,
            minlength: [ 3, 'Plate must be at least 3 characters long' ],
        },
        capacity: {
            type: Number,
            required: true,
            min: [ 1, 'Capacity must be at least 1' ],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: [ 'car', 'motorcycle', 'auto' ],
        }
    },
    location: {
        ltd: {
            type: Number,
        },
        lng: {
            type: Number,
        }
    }

})

export default mongoose.model("Captain", captainScheam);
