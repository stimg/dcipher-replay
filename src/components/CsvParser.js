export default class CsvParser {
    static parse(csvString) {
        const rows = csvString.split('\n');
        const headers = rows.shift().split(',');

        return rows.map(row => {
            const obj = {};
            const data = row.split(',');
            headers.forEach((header, index) => {
                obj[header] = data[index];
            });
            return obj;
        });
    }
}