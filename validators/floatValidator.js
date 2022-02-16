
function floatValidator(name) {
    return /^\d{1,}[\.]{0,1}\d{0,}$/.test(name)
}

module.exports=floatValidator