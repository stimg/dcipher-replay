import CsvParser from "./CsvParser";

export default class FileLoader {

    static fileList;
    eventsFile = "events.csv";
    clicksFile = "clicks.csv";

    constructor(fileList) {
        this.fileList = fileList;
    }

    static readFile(file) {

    }

    findFile(fileName) {
        const fl = this.fileList;
        let file = null;
        for (let i = 0, len = fl.length; i < len; i++) {
            file = fl[i];
            if (file.name === fileName) return file;
        }
        return null;
    }

    // loadImage(name) {}

    loadEventData() {

        return new Promise((resolve, reject) => {
            const file = this.findFile(this.eventsFile);
            const fr = new FileReader();
            fr.onload = event => {
                const csv = event.target.result;
                const events = CsvParser.parse(csv);
                resolve(events);
            };
            fr.onerror = err => {
                reject(err);
            };
            fr.readAsText(file);
        });
    };

}