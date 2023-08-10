import express from 'express';
import { activateAccount, forgotPassword, getAllOTP, getAllUsers, Login, LogOut, Register, updatePassword, verifyOTP } from '../Controllers/Auth.js';
const router = express.Router()

router.post('/register', Register)
router.post('/activate-acount', activateAccount )
router.post('/login', Login)
router.get('/logout', LogOut)
router.post('/forgot-password', forgotPassword)
router.post('/update-password', updatePassword)
router.post('/verifyOtp', verifyOTP)
router.get('/get-all', getAllUsers)
router.get('/get-all-otp', getAllOTP)

export default router;