function timestampValidator(name) {
    return /^(\d){4}[\-](\d){2}[\-](\d){2}[ ]{1}[0,1,2]{1}(\d){1}([\:][0,1,2,3,4,5,6]{1}(\d){1}){2}$/.test(name)
}
module.exports=timestampValidator