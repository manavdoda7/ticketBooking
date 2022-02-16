function intValidator(name) {
    return /^\d{1,}$/.test(name)
}

module.exports=intValidator