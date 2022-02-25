const checkAuth = require('../middlewares/providerAuthentication');
const nameValidator = require('../validators/nameValidator');
const timestampArrValidator = require('../validators/timestampArrValidator');
const ratedValidator = require('../validators/ratingValidator');
const floatValidator = require('../validators/floatValidator');
const intValidator = require('../validators/intValidator');
const router = require('express').Router()
const Models = require('../models/index');
const intArrValidator = require('../validators/intArrValidator');

/**
 * @swagger
 * /api/provider/shows:
 *  get:
 *      tags: ["Provider Routes"]
 *      summary: "Route to get all the shows of a provider"
 *      description: "Provider is identified by the header passed"
 *      parameters: []
 *      responses: []
 *  post:
 *      tags: ["Provider Routes"]
 *      summary: "Route to create a new show"
 *      description: "Provider is identified uniquely by token."
 *      parameters:
 *        - name: body
 *          in: body
 *          description: "Enter show Details here"
 *          required: true
 *          schema:
 *              type: object
 *              properties:
 *                  name:
 *                      type: string
 *                  info:
 *                      type: string
 *                  timings:
 *                      type: array
 *                      items:
 *                          type: string
 *                  halls:
 *                      type: array
 *                      items:
 *                          type: integer
 *                  duration:
 *                      type: string
 *                  rated:
 *                      type: string
 *                  ratings:
 *                      type: number
 *          responses: []
 * /shows/{id}:
 *  get:
 *      tags: ["Provider Routes"]
 *      summary: "Route for getting details about a particular show."
 *      description: "Authentication is done by header."
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *      responses: []
 *  delete:
 *      tags: ["Provider Routes"]
 *      summary: "Route for deleting a show."
 *      description: "Authentication is done by header."
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *      responses: []
 * /shows/slot/:id:
 *  get:
 *      tags: ["Provider Routes"]
 *      summary: "Route for fetching bookings of a particular slot."
 *      description: "Authentication is done by header"
 *      parameters:
 *        - name: id
 *          in: path
 *          required: true
 *          type: string
 *      responses: []
 */

router.post('/shows', checkAuth, async(req, res)=>{
    console.log('POST /api/provider/show request');
    const {name, info, duration, rated, ratings, halls, timings} = req.body
    const provider_id = req.providerData.email
    // Will add validators to each here
    if(!(nameValidator(name)&&nameValidator(info)&&ratedValidator(rated)&&floatValidator(ratings)&&timestampArrValidator(timings)&&intArrValidator(halls)))
        return res.status(206).json({success:false, message:'One or more feild values are incorrect.'})
    let hallsCount
    try {
        hallsCount = await Models.provider.findAll({
            where: {
                email: provider
            }
        })
        hallsCount = hallsCount[0].dataValues.halls
    } catch(err) {
        console.log('Error in fetching halls',err);
    }
    for(i=0;i<halls.length;i++) if(halls[i]>hallsCount||halls[i]<1) return res.status(206).json({success:false, message:`You have only ${hallsCount} halls.`})
    // console.log(halls, timings)
    if(halls.length!=timings.length) return res.status(206).json({success:false, message:'size of halls array should be equal to timings array.'})
    let showsAlreadyRegistered
    try{
        showsAlreadyRegistered = await Models.hallBooking.findAll({
            where:{
                provider_id:provider_id
            }
        })
    } catch(err) {
        console.log('Error in fetching hall bookings', err)
        return res.status(408).json({success:false, message:'Please try gain after sometime.'})
    }
    var set = new Set()
    for(i=0;i<showsAlreadyRegistered.length;i++) {
        let parsed = Number(showsAlreadyRegistered[i].dataValues.begTime).toString()+showsAlreadyRegistered[i].dataValues.hallNumber
        set.add(parsed)
        console.log(i, parsed)
    }
    for(i=0;i<timings.length;i++) {
        let parsed = Number(Date.parse(timings[i])).toString()+halls[i]
        if(Date.parse(timings[i])<new Date()) return res.status(206).json({success:false, message:'You can\'t book a show in past.'})
        if(set.has(parsed)) return res.status(206).json({success:false, message:`Hall ${halls[i]} is already booked for ${timings[i]}`})
        set.add(parsed)
        console.log(i, parsed)
    }
    let arr = []
    let showDetails
    try {
        showDetails = await Models.show.create({name, info, provider_id, duration, rated, ratings})
    } catch(err) {
        console.log('Error in saving show.', err)
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    for(i=0;i<halls.length;i++) {
        let obj = {begTime:timings[i], hallNumber:halls[i], provider_id, show_id:showDetails.dataValues.id}
        arr.push(obj)
    }
    try {
        await Models.hallBooking.bulkCreate(arr)
    } catch(err) {
        console.log('Error in hall booking.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(201).json({success:true, message: 'Show created.'})
})

router.get('/shows', checkAuth, async(req, res)=>{
    console.log('GET /api/provider/shows request');
    const provider = req.providerData.email
    let show
    try {
        show = await Models.show.findAll({
            include:[{
                association:'hallBookings',
                attributes:['hallNumber','begTime']
            }],
            where:{
                provider_id:provider
            },
            attributes:['id', 'name','info', 'duration', 'rated', 'ratings', 'provider_id', 'hallBookings.begTime']
        })
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    console.log(show);
    return res.status(200).json({success:true, message:'Successful', shows: show})
})

router.get('/shows/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`GET /api/provider/${id} request`);
    let email = req.providerData.email
    let show
    try {
        show = await Models.show.findAll({
            include:[{
                association:'hallBookings',
                attributes:['hallNumber','begTime', 'id']
            }],
            where:{
                id:id,
                provider_id:email
            },
            attributes:['id', 'name','info', 'duration', 'rated', 'ratings', 'provider_id', 'hallBookings.begTime']
        })
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    if(show.length==0) return res.status(404).json({success:false, message:'Following show either doesn\'t exist or doesn\'t belong to you.'})
    return res.status(200).json({success:true, message:'Successful', show: show[0]})
})

router.get('/shows/slot/:id', checkAuth, async(req, res)=> {
    const id = req.params.id
    console.log('GET /user/shows/slots/'+id+' request')
    try {
        let slot = await Models.hallBooking.findOne({
            where: {
                id:id
            }
        })
        if(slot.dataValues.provider_id!=req.providerData.email) return res.status(403).json({success:false, message:'Forbidden'})
    } catch(err) {
        console.log('Error in fetching show slots.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    let bookings
    try{
        bookings = await Models.booking.findAll({
            include:{
                association:'client',
                attributes:['email', 'firstName', 'lastName', 'mobile']
            },
            attributes:['id', 'seat'],
            where:{
                hallBooking_id:id
            }
        })
    } catch(err) {
        console.log('Error in fetching bookings.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, bookings:bookings})
})

router.delete('/shows/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`DELETE /api/provider/${id} request`);
    try {
        let shows = await Models.show.findAll({
            where:{
                id:id
            }
        })
        if(shows.length==0 || shows[0].provider_id!=req.providerData.email) {
            return res.status(206).json({success:false, message:'Following show either doesn\'t exist or doesn\'t belong to you.'})
        }
    } catch(err) {
        console.log(`Error in fetching show`, err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    try {
        await Models.show.destroy({
            where:{
                id:id
            }
        })
    } catch(err) {
        console.log('Error in deleting show', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'Show deleted Successfully.'})
})

module.exports=router
