
import express from 'express'
import { adminLogin, Adminlogout, CreateEmpolye, deleteEmploye, getEmployeeById, getEmployees, updateEmployee, updateStatus } from '../controllers/empolyeController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/create', authMiddleware, CreateEmpolye)

router.get('/getemploye', authMiddleware, getEmployees)

router.put('/getemploye/:id', authMiddleware, updateStatus)

router.get('/employee/:id', authMiddleware, getEmployeeById)

router.put('/employee/:id', authMiddleware, updateEmployee);

router.delete('/deleteemploye/:id', authMiddleware, deleteEmploye)

router.post('/login', adminLogin)

router.post('/logout',Adminlogout)








export default router