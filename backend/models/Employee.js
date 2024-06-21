import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name:
    { type: String, required: true },
  email:
    { type: String, required: true, unique: true },
  mobile:
    { type: String, required: true },
  designation:
    { type: String, required: true },
  gender:
    { type: String, required: true },
  courses:
    { type: [String], required: true },
  imageUrl:
    { type: String, required: true },
  isActive:
    { type: Boolean, default: true },
  createDate:
    { type: Date, default: Date.now }
});

const Employee = mongoose.model('Employee', employeeSchema);

export default Employee;
