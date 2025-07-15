import {IEvents} from "./events";

export abstract class Model{
	constructor( protected events: IEvents) {
	}

	emitChanges(event: string, payload?: object) {
		// Состав данных можно модифицировать
		this.events.emit(event, payload ?? {});
	}

}