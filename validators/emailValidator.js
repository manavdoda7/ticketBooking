function ValidateEmail(mail) 
{
    return /^(\w|\d|\-|\.){2,}@(\w|\d|\-){1,}([\.](\w){2,3}){1,2}$/.test(mail)
}

module.exports = ValidateEmail