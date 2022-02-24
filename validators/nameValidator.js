function nameValidator(name) {
    return /^[A-Za-z\s.\-]+$/.test(name)
}

module.exports=nameValidator