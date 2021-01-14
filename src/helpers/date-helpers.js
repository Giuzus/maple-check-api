module.exports = {
    GetStartOfWeek(date, resetDay) {
        let startOfWeek = new Date(date);
        while (startOfWeek.getDay() != resetDay) {
            startOfWeek.setDate(startOfWeek.getDate() - 1);
        }
        return startOfWeek;
    },

    GetEndOfWeek(startOfWeek) {
        let endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(endOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        return endOfWeek;
    }
}