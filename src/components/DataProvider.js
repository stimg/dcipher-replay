import CsvParser from "./CsvParser";

export default class DataProvider {

    static fileList;
    static eventList;
    static eventsFile = "events.csv";
    static clicksFile = "clicks.csv";

    static getFrameImageUrl(frameNumber) {
        const event = DataProvider.eventList[frameNumber];
        const file = DataProvider.findFile(event.Image);
        return window.URL.createObjectURL(file);
    }

    static findFile(fileName) {
        const fl = this.fileList;
        let file = null;
        for (let i = 0, len = fl.length; i < len; i++) {
            file = fl[i];
            if (file.name === fileName) return file;
        }
        return null;
    }

    static loadEventData() {
        return new Promise((resolve, reject) => {
            const file = DataProvider.findFile(DataProvider.eventsFile);
            const fr = new FileReader();
            fr.onload = event => {
                const csv = event.target.result;
                const eventList = CsvParser.parse(csv);
                DataProvider.eventList = eventList;
                resolve(eventList);
            };
            fr.onerror = err => {
                reject(err);
            };
            fr.readAsText(file);
        });
    };

}