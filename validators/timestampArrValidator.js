const timestampValidator = require('./timestampValidator')
function timestampArrValidator(name) {
    if(typeof(name)!=typeof({}) || name.length==undefined || name.length<1) return false
    for(i=0;i<name.length;i++) if(timestampValidator(name[i]))
    return true
}
module.exports=timestampArrValidator
