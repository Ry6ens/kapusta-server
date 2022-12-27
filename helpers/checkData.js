const checkData = (first, second) => {
    let result = "";
    if(!first) {
        result = second;
    } else {
        result = first;
    }
    return result;
}


module.exports = checkData; 