function mobileValidator(name) {
    return /^\d{10}$/.test(name)
}

module.exports=mobileValidator