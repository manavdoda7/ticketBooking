const checkAuth = require('../middlewares/providerAuthentication');
const Show = require('../models/show');
const Booking = require('../models/booking');
const nameValidator = require('../validators/nameValidator');
const timestampValidator = require('../validators/timestampValidator');
const ratedValidator = require('../validators/ratingValidator');
const floatValidator = require('../validators/floatValidator');
const intValidator = require('../validators/intValidator');
const router = require('express').Router()

router.post('/', checkAuth, async(req, res)=>{
    console.log('POST /api/provider request');
    const {name, info, begTime, duration, rated, ratings, seats} = req.body
    const provider = req.providerData.email
    // Will add validators to each here
    if(!(nameValidator(name)&&nameValidator(info)&&timestampValidator(begTime)&&ratedValidator(rated)&&floatValidator(ratings)&&intValidator(seats)))
        return res.status(403).json({success:false, message:'One or more feild values are incorrect.'})
    try {
        await Show.create({name, info, begTime, duration, rated, ratings, seats, provider})
    } catch(err) {
        console.log('Error in saving show.', err)
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    return res.status(201).json({success:true, message: 'Show created.'})
})

router.get('/', checkAuth, async(req, res)=>{
    console.log('GET /api/provider request');
    const provider = req.providerData.email
    let show
    try {
        show = await Show.findAll({
            where:{
                provider:provider
            }
        })
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    console.log(show);
    return res.status(200).json({success:true, message:'Successful', shows: show})
})

router.get('/:id', checkAuth, async(req, res)=>{
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

router.delete('/:id', checkAuth, async(req, res)=>{
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