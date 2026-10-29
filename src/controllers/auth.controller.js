const userModel = require('../models/user.schema')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const registerController = async (req,res) =>{
    //user kadna ghetlela data
    const {username,password,role} = req.body

    const  checkUser =await userModel.findOne({username})
    if (checkUser){
        return res.send('user already exist')
    }

    const hashedPassword = await bcrypt.hash(password,10)


    await userModel.create({
        username:username,
        password:hashedPassword,
        role:role
    })

    return res.send('user created successfully')

}

const loginController = async (req,res) =>{

    const {username,password} = req.body 

    const userDetails = await userModel.findOne({username:username})

    if(!userDetails){
        return res.send('invalid Credentials')
    }
    const checkPassword = await bcrypt.compare(password, userDetails.password)

    if(!checkPassword){
        return res.send('invalid Credentials')
    }
    const payload = {
        username:username,
        role:userDetails.role
    }
    const token = await jwt.sign(payload,process.env.SECRET_KEY)

    res.cookie('token',token)
    
    res.send({message:'login successfully' })
}
    

module.exports = {registerController,loginController}


