import UserModel from "../Model/User.model.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ENV from '../config.js'
import otpGenerator from 'otp-generator'

/**middleware for verify user */
export async function verifyUser(req,res,next){
    try {
        const { username } = req.method == "GET" ? req.query : req.body;

        //check the user existance
        let exist = await UserModel.findOne({ username });
        if(!exist) return res.status(404).send({ error: "Cant find user"});
        next();
    } catch (error) {
        return res.status(404).send({error: "Authentication error"})
    }
}

/**POST: http://localhost:8080/api/register */
export async function register(req,res){
   
    try {
        const {username,password,profile,email} =req.body;

        //check the existing user (in new mongoose findone will not take a callback fn so we have to change it to promise)
        // const existUsername = new Promise ((resolve,reject)=>{
        //     UserModel.findOne({username},function(err,user){
        //         if(err) reject(new Error(err))
        //         if(user)reject({error:"Please use unique username"});
        //         resolve();
        //     })
        // });
        //check the existing user new (here we use promise inside findone instead of callback)
        const existUsername=new Promise((resolve,reject)=>{
            UserModel.findOne({username}).then((err,user)=>{
                if(err) reject(new Error(err))
                if(user)reject({error:"Please use unique username"});
                resolve();
            }).catch(err=>reject({error:"exist username findone error"}));
        });

        //check the existing email
        const existEmail = new Promise ((resolve,reject)=>{
            UserModel.findOne({email}).then((err,email)=>{
                if(err) reject(new Error(err))
                if(email)reject({error:"Please use unique email"});
                resolve();
            }).catch(err=>reject({error:"exist email findone error"}));
        });

        Promise.all([existUsername,existEmail])
        .then(()=>{
            if(password){
                bcrypt.hash(password,10).then(hashedPassword =>{
                    const user = new UserModel({
                        username,
                        password:hashedPassword,
                        profile:profile || '',
                        email
                    });
                    //return savd result as a response
                    user.save()
                    .then(result=> res.status(201).send({msg:"User Register succesfull"}))
                    .catch(error=>res.status(500).send({error}))
                }).catch(error=>{
                    return res.status(500).send({
                        error : "Enable to hashed password"
                    })
                })
            }
        }).catch(error=>{
            return res.status(500).send({error})
        })

    } catch (error) {
        return res.status(500).send(error);
    }
}

/**POST: http://localhost:8080/api/login */
export async function login(req,res){
    const {username,password} =req.body;
    try {
        UserModel.findOne({username})
            .then(user =>{
                bcrypt.compare(password,user.password)
                    .then(passwordCheck =>{
                        if(!passwordCheck) return res.status(400).send({error : "Don't have password"});

                        //Create jwt token
                        const token =  jwt.sign({
                            userId :user._id,
                            username :user.username
                        },ENV.JWT_SECRET,{expiresIn :"24h"});

                        return res.status(200).send({
                            msg: "login Successfull...!",
                            username: user.username,
                            token
                        });

                    })
                    .catch(error =>{
                        return res.status(400).send({error : "Password does not match"})
                    })
            })
            .catch(error =>{
                return res.status(404).send({error : "Username not found"})
            })


    } catch (error) {
        return res.status(500).send({error});
    }
}

/**GET: http://localhost:8080/api/user/username123 */
export async function getUser(req,res){
    const {username} = req.params;
    try {
        if(!username) return res.status(501).send({error : "Invalid Username"});

        UserModel.findOne({username},function (err,user){
            if(err) return res.status(500).send({err});
            if(!user) return res.status(501).send({error:"Couldn't find user data"});

            /**remove password from user */
            //mongoose return unnecessary data with object so convert it to json
            const {password, ...rest} = Object.assign({},user.toJSON());
            return res.status(201).send(rest);
        })
    } catch (error) {
        return res.status(404).send({error : "Cannot find user data"});
    }
}

/**PUT: http://localhost:8080/api/updateUser */
export async function updateUser(req,res){
    try {
        // const id =req.query.id;
        const {userId} =req.user;

        if(userId){
            const body = req.body;

            //update user
            UserModel.updateOne({ _id : userId},body,function(err,data){
                if(err) throw err;
                return res.status(201).send({msg :"Profile updated...!"})
            })
        }else{
            return res.status(401).send({error: "User not found...!"})
        }
        } catch (error) {
    return res.status(401).send({error});    
    }
}

/**GET: http://localhost:8080/api/generateOTP */
export async function generateOTP(req,res){
   req.app.locals.OTP = await otpGenerator.generate(6,{lowerCaseAlphabets : false,upperCaseAlphabets:false,specialChars: false})
    res.status(201).send({code: req.app.locals.OTP})
    
}

/**GET: http://localhost:8080/api/verifyOTP */
export async function verifyOTP(req,res){ 
    const {code} = req.query;
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP = null; //reset the OTP value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(201).send({msg:'Verified successfully...!'})
    }
    return res.status(400).send({error: "Invalid OTP"});
}

// succesfully redirect user when OTP is valid
/**GET: http://localhost:8080/api/createResetSession */
export async function createResetSession(req,res){
    if(req.app.locals.resetSession){
        req.app.locals.resetSession = false; //allow access to this route only once
        return res.status(201).send({msg: "access granted"})
    }
    return res.status(440).send({error: "session expired"})
}

//update the password when we have valid session
/**PUT: http://localhost:8080/api/resetPassword */
export async function resetPassword(req,res){
    try {
        const {username,password} = req.body;

        if(!req.app.locals.resetSession) return res.status(440).send({error: "session expired"})
        try {
           UserModel.findOne({username})
           .then(user =>{
                bcrypt.hash(password,10)
                    .then(hashedPassword =>{
                        UserModel.updateOne({username : user.username},{password : hashedPassword},function(err,data){
                            if(err) throw error;
                            req.app.locals.resetSession = false; //reset session
                            return res.status(201).send({msg : "Record Updated...!"})
                        })
                    })
                    .catch(e=>{
                        return res.status(500).send({
                            error : "Enable to hashed password"
                        })
                    })
           })
           .catch(error=>{
                return res.status.send({error:"Username not found"})
           }) 
        } catch (error) {
            return res.status(500).send({error})
        }
    } catch (error) {
        return res.status(401).send({error})
    }
}