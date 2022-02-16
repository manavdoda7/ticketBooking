const ValidateEmail = require('../validators/emailValidator');
const nameValidator = require('../validators/nameValidator');
const router = require('express').Router()
const bcrypt = require('bcrypt');
const Provider = require('../models/provider');
const User = require('../models/client');
const jwt = require('jsonwebtoken')

router.post('/provider/register', async(req, res)=>{
    console.log('POST /api/authenticate/provider/register request');
    const {email, password, firstName, lastName, organisation} = req.body
    if(email==null|| email=='' || password==null || password=='' || firstName==null || firstName=='' || lastName==null || lastName=='' || organisation==null || organisation=='') {
        return res.status(403).json({success:false, message:'One or more feilds is/are missing'})
    }
    if(ValidateEmail(email)==false) {
        return res.status(403).json({success: false, message:'Invalid email ID'})
    }
    if(nameValidator(firstName)==false || nameValidator(lastName)==false) {
        return res.status(403).json({success:false, message:'Invalid name entered.'})
    }
    if(nameValidator(organisation)==false) {
        return res.status(403).json({success:false, message:'Invalid organisation name entered.'})
    }
    let duplicate
    try {
        duplicate = await Provider.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in checking for the duplicates.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    if(duplicate.length) return res.status(403).json({success:false, message:'You\'re already registered.'})
    let encryptedPassword
    try {
        encryptedPassword = await bcrypt.hash(password, 10)
    } catch(err) {
        console.log('Password encryption error', err)
        return res.status(408).json({success:false, message:'Please try again after sometime'})
    }
    // const provider = new Provider(email, encryptedPassword, firstName, lastName, organisation)
    try {
        await Provider.create({email:email, firstName:firstName, lastName:lastName, password:encryptedPassword, org:organisation})
    } catch(err) {
        console.log('Error in saving to database', err)
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'User registered'})
}) 

router.post('/provider/login', async(req, res)=>{
    console.log('GET /api/authenticate/provider/login request')
    const {email, password} = req.body
    if(email==null || email=='' || password==null || password=='' || ValidateEmail(email)==false) {
        return res.status(403).json({success:false, message:'Please enter all the feilds correctly'})
    }
    let provider
    try {
        provider = await Provider.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in fetching provider', err)
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    if(provider.length==0) {
        return res.status(403).json({success:false, message:'Invalid Credentials'})
    }
    provider = provider[0].dataValues
    // console.log(provider.password);
    bcrypt.compare(password, provider.password, function(err, result){
        if(err) {
            console.log('Bcrypt Error', err)
            return res.status(408).json({success:false, message:'Please try again after sometime.'})
        }
        else if(result==0) {
            return res.status(403).json({success:false, message:'Invalid Credentials'})
        }
        else {
            const token = jwt.sign({
                email: provider.email,
                fName: provider.firstName,
                lName: provider.lastName
            }, process.env.JWT_SECRET_PROVIDER, {
                expiresIn: '6h'
            })
            // console.log('Auth successful', token);
            return res.status(202).json({success:true, message:'Authenication successful.', token:token})
        }
    })
})

router.post('/user/register', async(req, res)=>{
    console.log('POST /api/authenticate/user/register request');
    const {email, mobile, firstName, lastName, password} = req.body
    if(email==null|| email=='' || password==null || password=='' || firstName==null || firstName=='' || lastName==null || lastName=='' || mobile==null || mobile=='') {
        return res.status(403).json({success:false, message:'One or more feilds is/are missing'})
    }
    if(ValidateEmail(email)==false) {
        return res.status(403).json({success: false, message:'Invalid email ID'})
    }
    if(nameValidator(firstName)==false || nameValidator(lastName)==false) {
        return res.status(403).json({success:false, message:'Invalid name entered.'})
    }
    if(mobile.length<10) {
        return res.status(403).json({success:false, message:'Invalid mobile number entered.'})
    }
    let duplicate
    try {
        duplicate = await User.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in checking for the duplicates.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    if(duplicate.length) {
        return res.status(403).json({success:false, message:'Email already exists.'})
    }
    let encryptedPassword
    try {
        encryptedPassword = await bcrypt.hash(password, 10)
    } catch(err) {
        console.log('Password encryption error', err)
        return res.status(408).json({success:false, message:'Please try again after sometime'})
    }
    // const user = new User(email, encryptedPassword, firstName, lastName, mobile)
    try {
        await User.create({email, password:encryptedPassword, firstName, lastName, mobile})
    } catch(err) {
        console.log('Error in saving to database', err)
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'User registered'})
})

router.post('/user/login', async(req, res)=>{
    console.log('POST /api/authenticate/user/login request');
    const {email, password} = req.body
    if(email==null || email=='' || password==null || password=='' || ValidateEmail(email)==false) {
        return res.status(403).json({success:false, message:'Please enter all the feilds correctly'})
    }
    let user
    try {
        user = await User.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in fetching provider', err)
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    if(user.length==0) return res.status(403).json({success:false, message:'Invalid Credentials'})
    user = user[0].dataValues
    bcrypt.compare(password, user.password, function(err, result){
        if(err) {
            console.log('Bcrypt Error', err)
            return res.status(408).json({success:false, message:'Please try again after sometime.'})
        }
        else if(result==0) {
            return res.status(403).json({success:false, message:'Invalid Credentials'})
        }
        else {
            const token = jwt.sign({
                email: user.email,
                fName: user.firstName,
                lName: user.lastName
            }, process.env.JWT_SECRET_USER, {
                expiresIn: '6h'
            })
            // console.log('Auth successful', token);
            return res.status(202).json({success:true, message:'Authenication successful.', token:token})
        }
    })
})

module.exports=router