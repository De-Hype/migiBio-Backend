import User from "../Model/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../utils/sendMail.js";
import Otp from "../Model/Otp.js";
import {v4 as uuidv4} from 'uuid'

export const Register = async (req, res) => {
  try {
    const createActivationToken = (user) => {
      return jwt.sign(user, process.env.Activation_Secret, {
        expiresIn: "30m",
      });
    };
    const { fullName, username, email, password } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(500).json({ sucess:false, message: "This User Already Exist" });
    }

    const user = { fullName, username, email, password };
    const activationToken = createActivationToken(user);
    const ActivationUrl = `${process.env.Activation_Url}/${activationToken}`;
    try {
      await sendMail({
        email: user.email,
        subject: "Activate Account",
         message:`Hello ${user.username}, please click on the link to activate your account: ${ActivationUrl}`,
        html: `<p><b>Hello ${user.username}, please click on the link to activate your account: <a style="color:black;" href=${ActivationUrl}>here</a></b></p>`
      });
    } catch (error) {
      console.log(error);
      console.log("Error Occured Sending Mail");
    }
    res
      .json({
        success: true,
        message: "Account Activation Link Sent To Mail Successfully",
      })
      .status(204);
  } catch (error) {
    console.error(error);
  }
};

export const activateAccount = async (req, res) => {
  const { activationToken } = req.params;
  console.log(activationToken)
  const newUser = jwt.verify(activationToken, process.env.Activation_Secret);
  if (!newUser) {
    return res
      .status(500)
      .json({ message: "This Token Is Invalid Or Has Expired" });
  }

  const { fullName, username, email, password } = newUser;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let findUser = await User({
    fullName,
    username,
    email,
    password: hashedPassword,
  });
  await findUser.save();
  return res
      .status(204)
      .json({  sucess:true, message: "Account Created Succesfully" });
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "User Does Not Exist" })
        .redirect("/register");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(404)
        .json({ message: "Username Or Password Is Incorrect" });
    }
    const token = jwt.sign({ id: user._id }, process.env.Jwt_Secret_Key);
    res.cookie('activeUser', token, {
      maxAge:36000000
    })
    // res.json({ token, userID: user._id });
    res.json({message:"Cookies succesfully set"})
  } catch (error) {
    console.log(error);
  }
};

export const LogOut = async (req, res) => {
  try {
  } catch (error) {
    console.error(error);
  }
};

//To Collect The Info Of The User And Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const findUser = await User.findOne({ email });
    if (!findUser) {
      return res
        .status(401)
        .json({  sucess:false, message: "User Does Not Exist" })
        .redirect("/register");
    }
    const user = { email };
    //Generate OTP Here

    const OTPTOSTRING = Math.floor(1000 + Math.random() * 9000);
    const OTP = `${OTPTOSTRING}`;

    try {
      await sendMail({
        email: user.email,
        subject: "OTP Verification",
        message: `Your OTP is ${OTP} and it expires in ten minutes`,
        html: `<p style="color:black; font-size:18px;">Your OTP is ${OTP} and it expires in ten minutes</p>`
      });
    } catch (error) {
      console.log(error);
      console.log("Error Occured Sending Mail");
    }

    let saveOTP = await Otp({ email, number: OTP});
    await saveOTP.save();
    res
      .json({
        success: true,
        message: "OTP Sent To Mail Successfully",
      })
      .status(204);
  } catch (error) {
    console.error(error);
  }
};

//To Verify OTP That The User Sends
export const verifyOTP = async (req, res) => {
  try {
    const { number } = req.body;
    // console.log(OTP)

   const findOTP = await Otp.findOne({ number })
    
console.log({findOTP})
    if (!findOTP) {
      return res.status(401).json({ message: "Wrong Credentials Or OTP Provided" });
    }

const hashedRID = uuidv4()
  
    const newOtpDB = await Otp.findOneAndUpdate({number}, {
      hashedRID
    });
    console.log(newOtpDB)
    await newOtpDB.save();
    //We Then Send Back This Random Id As A Response For Our Password Update
    return res.status(404).json({
      success: true,
      message: "Succesfully Changed The hashedRid",
      url: hashedRID,
    });
  } catch (error) {
    console.log(error);
  }
};

//To Create Password For The User That Forgot His Password
export const updatePassword = async (req, res) => {
  try {
    const { password  } = req.body;
    const {hashedRID} = req.params;
    
    const findOtp = await Otp.findOne({ hashedRID });
    console.log(findOtp)
    if (!findOtp) {
      return res.status(404).json({
        success: false,
        message:
          "Invalid Url, Looks Like You Will Have To Try Your Hacking Skills Elsewhere, You piece of shit!",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const {email} = findOtp
    const updatePassword = await User.findOneAndUpdate({email}, {
      password:hashedPassword,
    });
    await updatePassword.save();
    res.json({message:"Succefull Changed Password"})
  } catch (error) {
    console.log(error);
  }
};

export const getAllUsers = async (req, res) => {
  try {
      const allUsers =await User.find()
      
      if(!allUsers){
          res.json({message:"No Users Found"})
      }
      res.status('200').json({allUsers})
  } catch (error) {
      console.error('Error Occured')
  }
}


export const getAllOTP = async (req, res) => {
  try {
      const allotp =await Otp.find()
      
      if(!allotp){
          res.json({message:"No Otp Found"})
      }
      res.status('200').json({allotp})
  } catch (error) {
      console.error('Error Occured')
  }
}
