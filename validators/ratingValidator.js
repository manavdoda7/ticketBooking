function ratedValidator(name) {
    return /^\d{1,2}[\+]$/.test(name)
}

module.exports=ratedValidator