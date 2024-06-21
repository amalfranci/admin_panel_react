import mongoose from "mongoose";
import Admin from "../models/AdminLogin.js";

const dbCon= async() => {
    
    try {
       await  mongoose.connect(process.env.DB_URL)

        console.log("Database Connected Successfully")

        const existingAdmin = await Admin.findOne({ id: 1 });
    if (!existingAdmin) {
      const admin = new Admin();
      await admin.save();
      console.log('Admin user created with default values.');
    } else {
      console.log('Admin user already exists.');
    }
    }
    catch (error) {
        console.log(error)
    }
}


export default dbCon