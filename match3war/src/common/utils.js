exports.zeroFill = function(width, number, pad) 
{
    width -= number.toString().length
    if (width > 0) return new Array(width + (/\./.test(number) ? 2 : 1)).join(pad) + number
    return number + ''
}
