import  mongoose from 'mongoose'
const { Schema } = mongoose;

const adminSchema = new Schema({
  id: {
    type: Number,
    required: true,
    default: 1
  },
  username: {
    type: String,
    required: true,
    default: 'admin'
  },
  password: {
    type: String,
    required: true,
    default: 'password123' 
  }
});

adminSchema.index({ id: 1 }, { unique: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin
