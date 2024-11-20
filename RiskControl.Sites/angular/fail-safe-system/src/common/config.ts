import * as moment from "moment";

export class DateConfig {
    constructor(private day: moment.Moment) { }

    get today(): moment.Moment {
        return moment.utc(this.day);
    }
}

export let CONFIG = {
    date: new DateConfig(moment.utc().startOf('day')),
    dateFormatString: 'MMM DD, YYYY',
};