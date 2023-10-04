import { FilterModel } from '../filter';
import { GridModel } from './mode.model';
import { Injectable } from "@angular/core";

@Injectable()
export class ModeContext {
    data?: object;
    label: string;
    filterModel: FilterModel;
    gridModel: GridModel;

    static create(label: string, filterModel: FilterModel, param: boolean | GridModel): ModeContext {
        const modeContext = new ModeContext();
        modeContext.label = label;
        modeContext.filterModel = filterModel;
        if (param instanceof GridModel) {
            modeContext.gridModel = param;
        } else {
            modeContext.gridModel = new GridModel(param);
        }

        return modeContext;
    }
}
