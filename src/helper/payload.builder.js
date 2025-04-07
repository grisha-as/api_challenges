import { faker } from '@faker-js/faker';
import { json2xml } from'xml-js';

export class TodoBuilder {
	constructor() {
        this.data = {}; // Объект для хранения заданных параметров, можно задать не все параметры
    }
	addTitle(leght = 25) {
		this.data.title =  faker.string.alpha(leght);
		return this;
	}
	addDescription(leght = 15) {
		this.data.description = faker.string.alpha(leght);
		return this;
	}
	addStatus(bulian) {
		this.data.doneStatus =bulian;
		return this;
	}
    
	generate() {
		return { ...this.data }; // Возвращаем копию объекта с заданными параметрами
	}
};

export function payloadToXml (json) {
	const xmlString = json2xml(JSON.stringify(json), { compact: true, spaces: 2 });
	return xmlString;
};