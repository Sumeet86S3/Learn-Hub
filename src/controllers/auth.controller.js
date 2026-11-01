const userModel = require('../models/user.schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req,res) =>{
    //user kadna ghetlela data
    const {username,password,role} = req.body

    const  checkUser =await userModel.findOne({username})
    if (checkUser){
        return res.status(409).json({message: 'user already exist'})
    }

    const hashedPassword = await bcrypt.hash(password,10)


    await userModel.create({
        username:username,
        password:hashedPassword,
        role:role
    })

    return res.status(201).json({message: 'user created successfully'})

}

const loginController = async (req,res) =>{

    const {username,password} = req.body 

    const userDetails = await userModel.findOne({username:username})

    if(!userDetails){
        return res.status(401).json({message: 'invalid Credentials'})
    }
    const checkPassword = await bcrypt.compare(password, userDetails.password)

    if(!checkPassword){
        return res.status(401).json({message: 'invalid Credentials'})
    }
    const payload = {
        username:username,
        role:userDetails.role
    }
    const token = await jwt.sign(payload,process.env.SECRET_KEY)

    res.cookie('token',token)
    
    return res.json({
        message: 'login successfully',
        user: {
            username: userDetails.username,
            role: userDetails.role
        }
    })
}

const logoutController = (req, res) => {
    res.clearCookie('token')
    return res.json({message: 'logout successfully'})
}

module.exports = {registerController, loginController, logoutController}
