const ValidateEmail = require('../validators/emailValidator');
const nameValidator = require('../validators/nameValidator');
const router = require('express').Router()
const bcrypt = require('bcrypt');
const Provider = require('../models/provider');
const User = require('../models/client');
const Models = require('../models/index');
const jwt = require('jsonwebtoken');
const passwordValidator = require('../validators/passwordValidator');
const mobileValidator = require('../validators/mobileValidator');
const intValidator = require('../validators/intValidator');
const intArrValidator = require('../validators/intArrValidator');

/**
 * @swagger
 * /:
 *  get:
 *      tags: ["Testing Route"]
 *      parameters: []
 *      responses: []
 *      security:
 *          bearerAuth: []
 * /api/authenticate/provider/register:
 *  post:
 *      tags: ["Authentication Routes"]
 *      summary: "Route for registering a new provider."
 *      description: "Register for a new provider here."
 *      parameters:
 *        - name: body
 *          in: body
 *          description: "Provider details"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  org:
 *                      type: string
 *                  halls:
 *                      type: integer
 *                  hallsCapacity:
 *                      type: array
 *                      items:
 *                          type: integer
 *      responses: []
 *      security:
 *          bearerAuth: []
 * /api/authenticate/provider/login:
 *  post:
 *      tags: ["Authentication Routes"]
 *      summary: "Route for provider login."
 *      description: "Enter email and password to login"
 *      parameters:
 *        - name: body
 *          in: body
 *          description: "Provider details"
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses: []
 *      security:
 *          bearerAuth: []
 * /api/authenticate/user/register:
 *  post:
 *      tags: ["Authentication Routes"]
 *      summary: "Route for registering a new user."
 *      description: "Register for a new user here."
 *      parameters:
 *        - name: body
 *          in: body
 *          description: "User details"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *                  firstName:
 *                      type: string
 *                  lastName:
 *                      type: string
 *                  org:
 *                      type: string
 *                  mobile:
 *                      type: string
 *      responses: []
 *      security:
 *          bearerAuth: []
 * /api/authenticate/user/login:
 *  post:
 *      tags: ["Authentication Routes"]
 *      summary: "Route for user login."
 *      description: "Enter email and password to login"
 *      parameters:
 *        - name: body
 *          in: body
 *          description: "User details"
 *          schema:
 *              type: object
 *              properties:
 *                  email:
 *                      type: string
 *                  password:
 *                      type: string
 *      responses: []
 *      security:
 *          bearerAuth: []
 */

router.post('/provider/register', async(req, res)=>{
    console.log('POST /api/authenticate/provider/register request');
    const {email, password, firstName, lastName, organisation, halls, hallsCapacity} = req.body
    if(ValidateEmail(email)==false) {
        return res.status(206).json({success: false, message:'Invalid email ID'})
    }
    if(nameValidator(firstName)==false || nameValidator(lastName)==false) {
        return res.status(206).json({success:false, message:'Invalid name entered.'})
    }
    if(nameValidator(organisation)==false) {
        return res.status(206).json({success:false, message:'Invalid organisation name entered.'})
    }
    if(passwordValidator(password)==false) {
        return res.status(206).json({success:false, message:'Invalid password.'})
    }
    if(intValidator(halls)==false) {
        return res.status(206).json({success:false, message:'Invalid hall numbers.'})
    }
    console.log('a');
    if(hallsCapacity.length!=halls || intArrValidator(hallsCapacity)==false) {
        return res.status(206).json({success:false, message:'Invalid halls array'})
    }
    let duplicate
    try {
        duplicate = await Models.provider.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in checking for the duplicates.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    if(duplicate.length) return res.status(206).json({success:false, message:'You\'re already registered.'})
    let encryptedPassword
    try {
        encryptedPassword = await bcrypt.hash(password, 10)
    } catch(err) {
        console.log('Password encryption error', err)
        return res.status(408).json({success:false, message:'Please try again after sometime'})
    }
    console.log('b');
    // const provider = new Provider(email, encryptedPassword, firstName, lastName, organisation)
    let arr=[]
    for(i=0;i<hallsCapacity.length;i++) {
        arr.push({hallNumber:i+1, seats:hallsCapacity[i], provider_id:email})
    }
    try {
        await Models.provider.create({email:email, firstName:firstName, lastName:lastName, password:encryptedPassword, org:organisation, halls:halls})
    } catch(err) {
        console.log('Error in saving to database', err)
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    console.log('c');
    try {
        await Models.hallsCapacity.bulkCreate(arr)
    } catch(err) {
        console.log('Error in saving halls array.', err);
        return res.status(408).json({success:false, message: 'Please try again after sometime.'})
    }
    console.log('d');
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
        provider = await Models.provider.findAll({
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
    if(ValidateEmail(email)==false) {
        return res.status(206).json({success: false, message:'Invalid email ID'})
    }
    if(nameValidator(firstName)==false || nameValidator(lastName)==false) {
        return res.status(206).json({success:false, message:'Invalid name entered.'})
    }
    if(mobile.length<10) {
        return res.status(206).json({success:false, message:'Invalid mobile number entered.'})
    }
    if(passwordValidator(password)==false) return res.status(206).json({success:false, message:'Invalid password.'})
    if(mobileValidator(mobile)==false) return res.status(206).json({success:false, message:'Invalid mobile number.'})
    let duplicate
    try {
        duplicate = await Models.client.findAll({
            where:{
                email:email
            }
        })
    } catch(err) {
        console.log('Error in checking for the duplicates.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    if(duplicate.length) {
        return res.status(206).json({success:false, message:'Email already exists.'})
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
        await Models.client.create({email, password:encryptedPassword, firstName, lastName, mobile})
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
        user = await Models.client.findAll({
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