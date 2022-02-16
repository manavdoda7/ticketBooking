const checkAuth = require('../middlewares/userAuthentication')
const Show = require('../models/show')
const Booking = require('../models/booking')
const intArrValidator = require('../validators/intArrValidator')

const router = require('express').Router()

router.get('/', async(req, res)=>{
    console.log('GET /api/user request')
    let shows
    try {
        shows = await Show.findAll()
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, shows:shows})
})

router.get('/bookings', checkAuth, async(req, res)=>{
    console.log('GET /api/user/bookings/ request')
    let bookings = await Booking.findAll({
        where:{
            clientID:req.userData.email
        }
    })

    console.log(bookings)
    return res.status(200).json({success:true, bookings:bookings})
})

router.get('/:id', async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`GET /api/user/${id} request`)
    let shows
    try {
        shows = await Show.findAll({
            where:{
                id:id
            }
        })
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
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
    shows=shows[0]
    // console.log(shows)
    let arr=[]
    for(i=0;i<shows.dataValues.seats;i++) arr.push(1)
    for(i=0;i<bookings.length;i++) arr[bookings[i].seat-1] = 0
    shows.dataValues.availableSeats = shows.seats - bookings.length
    shows.dataValues.bookedSeats = bookings.length
    return res.status(200).json({success:true, shows:shows, seatAvailability:arr})
})

router.post('/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`POST /api/user/${id} request`);
    const client = req.userData.email
    const seats = req.body.seats
    if(intArrValidator(seats)==false) return res.status(403).json({success:false, message:'invalid array passed.'})
    console.log(seats);
    let booked 
    try{
        booked = await Booking.findAll({
            where:{
                showID:id
            }
        })
    } catch(err) {
        console.log('Error in fetching bookings', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    let bookingSet = new Set()
    for(i=0;i<booked.length;i++) {
        bookingSet.add(booked[i].dataValues.seat)
    }
    console.log(booked)
    console.log(bookingSet.size);
    for(i=0;i<seats.length;i++) {
        if(bookingSet.has(seats[i])) return res.status(408).json({success:false, message:`Seat ${seats[i]} is already booked.`})
    }
    let arr = []
    for(i=0;i<seats.length;i++) {
        let obj = {showID:id, clientID:client, seat:seats[i], createdAt: new Date(), updatedAt:new Date()}
        arr.push(obj)
    }
    try {
        await Booking.bulkCreate(arr)
    } catch(err) {
        console.log('Error in booking.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    console.log(arr);
    return res.status(201).json({success:true, message:'Tickets booked'})
})

module.exports=router