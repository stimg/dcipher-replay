export default class CsvParser {
    static parse(csvString) {
        const rows = csvString.split('\n');
        const headers = rows.shift().split(',');
        const len = headers.length;
        let events = [];

        rows.forEach(row => {
            const obj = {};
            const data = row.split(',');
            if (data.length === len) {
                headers.forEach((header, index) => {
                    obj[header] = data[index];
                });
                events.push(obj);
            }
        });
        return events;
    }
}