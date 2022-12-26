const monthlyData = (result) => {
    const monthlySum = [];
    let sum = 0;
    const currentDate = new Date();
    for (let month = 0; month < 12; month += 1) {
    sum = result.reduce((s, i) => {
        const newDate = new Date(i.transitionDate);
            if(newDate.getMonth(i.transitionDate) === month && newDate.getFullYear(i.transitionDate) === currentDate.getFullYear() && i.transitionName === "income") {
                s = s + i.transitionValue;
            } if(newDate.getMonth(i.transitionDate) === month && newDate.getFullYear(i.transitionDate) === currentDate.getFullYear() && i.transitionName === "expenses") {
                s = s - i.transitionValue;
            }
                return s}, 0);
            const newDate = new Date(currentDate.getFullYear(), month);
            monthlySum.push({month: newDate.toLocaleString('en', { month: 'long' }), sum: sum});
    }
    function filterByYaer(item) {
        const newDate = new Date(item.transitionDate);
        const currentDate = new Date();
        if (newDate.getFullYear(item.transitionDate) === currentDate.getFullYear()) {
            return true;
        }
        return false;
    }

const transitions = result.filter(filterByYaer);

const newResult = {monthlySum, transitions};
    return newResult;
}

module.exports = monthlyData