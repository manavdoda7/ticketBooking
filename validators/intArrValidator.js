function intArrValidator(name) {
    return /^[\[]{1}[\ ]{0,}\d([\,[\ ]{0,}\d[\ ]{0,}){0,}[\]]$/.test(name)
}

module.exports=intArrValidator