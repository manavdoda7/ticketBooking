const intValidator = require('./intValidator')
function intArrValidator(name) {
    if(typeof(name)!=typeof({}) || name.length==undefined || name.length<1) return false
    for(i=0;i<name.length;i++) if(intValidator(name[i]))
    return true
}

module.exports=intArrValidator