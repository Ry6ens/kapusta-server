const convertDate = (result) => {
    const newDate = new Date(result);
    const dateMonth = newDate.getMonth(result);
    const dateYear = newDate.getFullYear(result);

    const reportDate = `${dateMonth}/${dateYear}`

    return reportDate;
}

module.exports = convertDate