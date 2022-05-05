import * as moment from 'moment';

export class ReportDate {
    constructor(
        private readonly _today: moment.Moment,
        private readonly _balanceUpDate: moment.Moment = _today,
        private readonly _moveBetDate: moment.Moment = _today
    ) { }

    get today(): moment.Moment {
        return this._today;
    }

    get yesterday(): moment.Moment {
        return moment.utc(this._today).add(-1, 'day');
    }

    get balanceUpDate(): moment.Moment {
        return this._balanceUpDate;
    }

    get moveBetDate(): moment.Moment {
      return this._moveBetDate;
  }
}

export const DATE_CONFIG = {
    reportDate: new ReportDate(moment.utc().startOf('day'), moment.utc().startOf('day'), moment.utc().startOf('day')),
    dateFormatString: 'MMM DD, YYYY',
    dateFormatString2: 'MMM_DD_YYYY',
    dateMonthFormatString: 'MM, YYYY',
    dateMonthFormatString2: 'MM_YYYY'
};
