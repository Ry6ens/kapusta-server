const reportData = (result) => {

    const getSum = (params) => {
        const sum = result.reduce((s, i) => {
            if(i.transitionName === params || i.transitionCategory === params || i.transitionDescription === params) {
                s = s + i.transitionValue;
            }
                return s}, 0);
        return sum;
    };

    const arrTransitionName = [... new Set(result.map(i => i.transitionName))];
    const arrTransitionCategory = [... new Set(result.map(i => i.transitionCategory))];
    const arrTransitionDescription = [... new Set(result.map(i => i.transitionDescription))];

    const getParamsName = (array) => {
        const result = [];
        let name = "";
        for(let i = 0; i < array.length; i += 1) {
            name = array[i];
            result.push({[`${name}`]: getSum(name)})
        }
        return result;
    };

    const sumByName = getParamsName(arrTransitionName);
    const sumByCategory = getParamsName(arrTransitionCategory);
    const sumByDescription = getParamsName(arrTransitionDescription);

    const resultData = {sumByName: sumByName, sumByCategory: sumByCategory, sumByDescription: sumByDescription}

    return resultData;
}

module.exports = reportData;