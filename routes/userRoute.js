const checkAuth = require('../middlewares/userAuthentication')
const Show = require('../models/show')

const router = require('express').Router()

router.get('/', async(req, res)=>{
    console.log('GET /api/user request')
    let shows
    try {
        shows = await Show.retreiveAllShows()
        shows = shows.rows
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    return res.status(200).json({success:true, shows:shows})
})

router.get('/:id', async(req, res)=>{
    const id = req.params.id
    console.log(`GET /api/user/${id} request`)
    let shows
    try {
        shows = await Show.retreiveShowsByID(id)
        shows = shows.rows
    } catch(err) {
        console.log('Error in fetching shows', err);
        return res.status(408).json({success: false, message: 'Please try again after sometime.'})
    }
    shows=shows[0]
    return res.status(200).json({success:true, shows:shows})
})

router.post('/:id', checkAuth, async(req, res)=>{
    const id = req.params.id
    console.log(`POST /api/user/${id} request`);
    const client = req.userData.email
    const seats = req.body.seats

})

module.exports=router