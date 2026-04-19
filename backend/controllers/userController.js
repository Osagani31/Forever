import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET);
}



//Route for user login
const loginUser =async(req,res)=>{

    try {

        const {email,password} = req.body;

        const user = await userModel.findOne({email});
        
        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({success:false,message:"Invalid credentials"});
        } else {
            const token=createToken(user._id);
            return res.status(200).json({success:true, token});
        }


    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:error.message});
        
    }


}

//Route for user registration
const registerUser =async(req,res)=>{
    try {
        const {name,email,password} = req.body;
      
        //Checking if user already exists

        const exists = await userModel.findOne({email});
        if(exists){
            return res.status(400).json({message:"User already exists"});
        }

        //Validating email and password
    
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Invalid email format"});
        }

        if(!validator.isLength(password, { min: 6 })){
            return res.status(400).json({message:"Password must be at least 6 characters long"});
        }

        //Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });
        

        await newUser.save();
        const token=createToken(newUser._id);
        return res.status(201).json({success:true, token, message:"User registered successfully"});


    } catch (error) {

        console.log(error);
        return res.status(500).json({success:false,message:error.message});
        
    }

   


}

//Route for admin login
const adminLogin =async(req,res)=>{
    try {
        const inputEmail = String(req.body?.email ?? req.body?.adminEmail ?? "").trim().toLowerCase();
        const inputPassword = String(req.body?.password ?? "").trim();
        const adminEmail = String(process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
        const adminPassword = String(process.env.ADMIN_PASSWORD ?? "").trim();

        if (!inputEmail || !inputPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        if (!adminEmail || !adminPassword) {
            return res.status(500).json({
                success: false,
                message: "Admin credentials are not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in backend .env"
            });
        }

        if (inputEmail === adminEmail && inputPassword === adminPassword) {
            const token = jwt.sign({ role: "admin", email: inputEmail }, process.env.JWT_SECRET);
            return res.status(200).json({ success: true, token });
        } else{
                return res.status(401).json({ success: false, message: "Invalid admin credentials" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: error.message });
    }

}

export {loginUser,registerUser,adminLogin};