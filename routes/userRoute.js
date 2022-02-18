const checkAuth = require('../middlewares/userAuthentication')
const Models = require('../models/index')
const intArrValidator = require('../validators/intArrValidator')
const intValidator = require('../validators/intValidator')

const router = require('express').Router()

router.get('/shows', async(req, res)=>{
    console.log('GET /api/user/shows request')
    let shows
    try {
        shows = await Models.show.findAll({
            attributes:['id', 'name', 'info', 'duration', 'ratings', 'rated', 'provider_id']
        })
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, shows:shows})
})

router.get('/bookings', checkAuth, async(req, res)=>{
    console.log('GET /api/user/bookings/ request')
    let bookings = await Models.booking.findAll({
        include:[{
            association:'hallBooking',
            attributes:['hallNumber', 'begTime']
        },
        {
            association: 'show',
            attributes:['id', 'name', 'info', 'ratings', 'rated','provider_id']
        }],
        where:{
            client_id:req.userData.email
        },
        attributes:['id', 'seat', 'client_id']
    })

    console.log(bookings)
    return res.status(200).json({success:true, bookings:bookings})
})

router.get('/shows/:id', async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`GET /api/user/shows/${id} request`)
    let shows
    try {
        shows = await Models.show.findAll({
            include:[{
                association:'hallBookings',
                attributes:['id','hallNumber','begTime']
            }],
            where:{
                id:id
            },
            attributes:['id', 'name','info', 'duration', 'rated', 'ratings', 'provider_id', 'hallBookings.begTime']
        })
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    shows=shows[0]
    return res.status(200).json({success:true, shows:shows})
})

router.get('/shows/slots/:slotID', async(req, res)=>{
    const slot_id = req.params.slotID
    if(intValidator(slot_id)==false) return res.status(404).json({success:false, message:'Invalid slot ID'})
    console.log(`GET /api/user/shows/slots/${slot_id}`)
    let showInfo
    let slotCheck
    try {
        slotCheck = await Models.hallBooking.findOne({
            where:{
                id:slot_id
            }
        })
        if(slotCheck==null) return res.status(404).json({success:false, message:'Invalid slot ID'})
    } catch(err) {
        console.log('Error in fetching slot.', err)
        return res.status(408).json({success:false, message: 'Please try again after sometime.'})
    }
    try {
        showInfo = await Models.hallBooking.findOne({
            include:[{
                association: 'show',
                attributes:['name', 'info', 'duration', 'rated', 'ratings', 'provider_id']
            }],
            where:{
                id:slot_id
            },
            attributes:['id', 'begTime', 'hallNumber', 'show_id']
        })
    }catch(err) {
        console.log('Error in fetching show info', err)
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    let hallNumber = showInfo.dataValues.hallNumber
    let provider_id = showInfo.dataValues.show.dataValues.provider_id
    let seats
    try {
        seats = await Models.hallsCapacity.findOne({
            where: {
                hallNumber:hallNumber,
                provider_id: provider_id
            },
            attributes: ['seats']
        })
    } catch(err) {
        console.log('Error in fetching hall info', err)
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    seats = seats.dataValues.seats
    let arr=[]
    let bookings
    try{
        bookings = await Models.booking.findAll({
            where:{
                hallBooking_id:slot_id
            }
        })
    } catch(err) {
        console.log('Error in fetching bookings.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    for(i=0;i<seats;i++) arr.push(1)
    for(i=0;i<bookings.length;i++) arr[bookings[i].seat-1] = 0
    showInfo.dataValues.availableSeats = seats - bookings.length
    showInfo.dataValues.bookedSeats = bookings.length
    return res.status(200).json({success:true, showInfo, seatsAvailability:arr})
})

router.post('/shows/slots/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    if(intValidator(id)==false) return res.status(404).json({success:false, message:'Invalid showID'})
    console.log(`POST /api/user/shows/slots/${id} request`);
    const client = req.userData.email
    const seats = req.body.seats
    let slotCheck
    try {
        slotCheck = await Models.hallBooking.findOne({
            where:{
                id:id
            }
        })
        if(slotCheck==null) return res.status(404).json({success:false, message:'Invalid slot ID'})
    } catch(err) {
        console.log('Error in fetching slot.', err)
        return res.status(408).json({success:false, message: 'Please try again after sometime.'})
    }
    if(intArrValidator(seats)==false) return res.status(403).json({success:false, message:'invalid array passed.'})
    console.log(seats);
    let booked 
    try{
        booked = await Models.booking.findAll({
            where:{
                hallBooking_id:id
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
        else bookingSet.add(seats[i])
    }
    let arr = []
    for(i=0;i<seats.length;i++) {
        let obj = {show_id:slotCheck.dataValues.show_id, hallBooking_id:slotCheck.dataValues.id, client_id:client, seat:seats[i], begTime:slotCheck.dataValues.begTime}
        arr.push(obj)
    }
    console.log(arr);
    try {
        await Models.booking.bulkCreate(arr)
    } catch(err) {
        console.log('Error in booking.', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    console.log(arr);
    return res.status(201).json({success:true, message:'Tickets booked'})
})

module.exports=router