const checkAuth = require('../middlewares/providerAuthentication');
const Show = require('../models/show');
const router = require('express').Router()

router.post('/', checkAuth, async(req, res)=>{
    console.log('POST /api/provider request');
    const {name, info, begTime, duration, rated, ratings, seats} = req.body
    const provider = req.providerData.email
    // Will add validators to each here
    const show = new Show(name, info, begTime, duration, rated, ratings, seats, provider)
    try {
        await Show.saveShow(show)
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
        show = await Show.retreiveShowsByProvider(provider)
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    show = show.rows
    return res.status(200).json({success:true, message:'Successful', shows: show})
})

router.get('/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    console.log(`GET /api/provider/${id} request`);
    let show
    try {
        show = await Show.retreiveShowsByID(id)
    } catch(err) {
        console.log('Error in fetching shows.', err) 
        return res.status(408).json({success: false, message:'Please try again after sometime.'})
    }
    show = show.rows
    return res.status(200).json({success:true, message:'Successful', show: show[0]})
})

router.delete('/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    console.log(`DELETE /api/provider/${id} request`);
    try {
        let shows = await Show.retreiveShowsByID(id)
        shows = shows.rows
        if(shows.length==0 || shows[0].provider!=req.providerData.email) {
            return res.status(403).json({success:false, message:'Following show either doesn\'t exist or doesn\'t belong to you.'})
        }
    } catch(err) {
        console.log(`Error in fetching show`, err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    try {
        await Show.deleteShow(id)
    } catch(err) {
        console.log('Error in deleting show', err);
        return res.status(408).json({success:false, message:'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, message:'Show deleted Successfully.'})
})

module.exports=router