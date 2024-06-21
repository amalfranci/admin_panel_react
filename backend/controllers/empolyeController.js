import Employee from "../models/Employee.js"
import Admin from "../models/AdminLogin.js";
import jwt from "jsonwebtoken";


//  for employe creation

const CreateEmpolye = async (req, res) => {
  try {
   const { name, email, mobile, designation, gender, courses, imageUrl,isActive } = req.body;

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if email already exists
    const existingEmployee = await Employee.findOne({ email: email });
    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Validate mobile number (numeric check)
    const mobileRegex = /^\d{10}$/; // Assuming 10-digit numeric format
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

  
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      imageUrl,
      isActive
    });

    
    await newEmployee.save();

    res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// for get employe data 

const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// for user active / deatcive purpose

const updateStatus = async (req, res) => {
    
    const { isActive } = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.json(employee);
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


// access a perticular employe 

const getEmployeeById = async (req, res) => {

    try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json(employee);
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
    

}



//  update employe data

const updateEmployee = async (req, res) => {
    
    try {
    const { id } = req.params;
    const { name, email, mobile, designation, gender, courses, isActive, imageUrl } = req.body;

    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.name = name;
    employee.email = email;
    employee.mobile = mobile;
    employee.designation = designation;
    employee.gender = gender;
    employee.courses = courses;
    employee.isActive = isActive;
    employee.imageUrl = imageUrl;

    await employee.save();
    
    res.status(200).json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error: error.message });
  }

}


// delete employee

const deleteEmploye = async (req, res) => {
  
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await employee.deleteOne();
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Failed to delete employee' });
  }

}


// for admin login 

const adminLogin = async (req,res) => {

  try {
      const { username, password } = req.body
  const user = await Admin.findOne({ username })
  if (!user) {
    return json({message:"user not exists"})
  }
  
  if (user.password!== password) {
    return res.json({message:"passwaord incorrect"})
  }
    const token = jwt.sign({ username: user.username }, process.env.KEY, { expiresIn: '1h' })

  res.cookie('token',token,{httpOnly:true,maxAge:360000})
  return res.json({status:true,message:"login successfully",token:token,user:user.username})
    
  }
  catch (error)
  {
    console.log(error)
  }
  

}

// for admin logout

const Adminlogout = async (req,res) => {
  
   res.clearCookie("token");
  return res.json({ status: true, message: "User logged out successfully" });

}



export  { CreateEmpolye ,getEmployees,updateStatus,getEmployeeById ,updateEmployee,deleteEmploye,adminLogin,Adminlogout};
