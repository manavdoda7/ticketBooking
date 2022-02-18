const checkAuth = require('../middlewares/providerAuthentication');
// const Show = require('../models/show');
// const Booking = require('../models/booking');
const nameValidator = require('../validators/nameValidator');
const timestampArrValidator = require('../validators/timestampArrValidator');
const ratedValidator = require('../validators/ratingValidator');
const floatValidator = require('../validators/floatValidator');
const intValidator = require('../validators/intValidator');
const router = require('express').Router()
const Models = require('../models/index');
const intArrValidator = require('../validators/intArrValidator');

router.post('/shows', checkAuth, async(req, res)=>{
    console.log('POST /api/provider/show request');
    const {name, info, duration, rated, ratings, halls, timings} = req.body
    const provider = req.providerData.email
    // Will add validators to each here
    if(!(nameValidator(name)&&nameValidator(info)&&ratedValidator(rated)&&floatValidator(ratings)&&timestampArrValidator(timings)&&intArrValidator(halls)))
        return res.status(403).json({success:false, message:'One or more feild values are incorrect.'})
    let showDetails
    try {
        showDetails = await Models.show.create({name, info, provider, duration, rated, ratings})
    } catch(err) {
        console.log('Error in saving show.', err)
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
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
    for(i=0;i<halls.length;i++) if(halls[i]>hallsCount||halls[i]<1) return res.status(403).json({success:false, message:`You have only ${hallsCount} halls.`})
    console.log(halls, timings)
    if(halls.length!=timings.length) return res.status(403).json({success:false, message:'size of halls array should be equal to timings array.'})
    let arr = []
    for(i=0;i<halls.length;i++) {
        let obj = {begTime:timings[i], hallNumber:halls[i], provider, showID:showDetails.dataValues.id}
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
        show = await Models.hallBooking.findAll({
            include: Models.show,
            where:{
                provider:provider
            }
        })
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    console.log(show);
    // select show.id, show.name, show.provider, show.duration, show.rated, show.ratings, array_agg("hallBooking"."hallNumber") as halls, array_agg("hallBooking"."begTime") as timings from show join "hallBooking" on show.id = "hallBooking"."showID" group by show.id;
    // try {
    //     Models.show.findAll({
    //         include: {
    //             model:'hallBooking',
    //         }
    //     })
    // }

    return res.status(200).json({success:true, message:'Successful', shows: show})
})

router.get('/shows/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`GET /api/provider/${id} request`);
    let show
    try {
        show = await Show.findAll({
            where:{
                id:id
            }
        })
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    let bookings
    try{
        bookings = await Booking.findAll({
            where:{
                showID:id
            }
        })
    } catch(err) {
        console.log('Error in fetching bookings.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'Successful', show: show[0], bookings:bookings})
})

router.delete('/shows/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`DELETE /api/provider/${id} request`);
    try {
        let shows = await Show.findAll({
            where:{
                id:id
            }
        })
        if(shows.length==0 || shows[0].provider!=req.providerData.email) {
            return res.status(403).json({success:false, message:'Following show either doesn\'t exist or doesn\'t belong to you.'})
        }
    } catch(err) {
        console.log(`Error in fetching show`, err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    try {
        await Show.destroy({
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
