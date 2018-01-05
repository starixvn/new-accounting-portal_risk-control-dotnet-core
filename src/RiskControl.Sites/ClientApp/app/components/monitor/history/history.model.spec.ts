import { HistoryModel } from './history.model';

export let fakeHistoryModelsWith3Items: HistoryModel[] = createHistoryModels(3);
export let fakeHistoryModelsWithNoItems: HistoryModel[] = createHistoryModels(0);

function createHistoryModels(count: number): HistoryModel[] {
    const historyModels: HistoryModel[] = [];
    for (let i = 1; i <= count; i++) {
        const historyModel: HistoryModel = createHistoryModel(i);
        historyModels.push(historyModel);
    }

    return historyModels;
}

function createHistoryModel(seed: number): HistoryModel {
    return {
        GroupId: seed,
        GroupName: seed.toString(),
        Currency: seed.toString(),
        BlackLimit: -seed,
        GreyLimit: -seed,
        OrangeLimit: seed,
        YellowLimit: seed,
        RedLimit: seed,
        WinningAmount: seed,
        WinningAmountRM: seed,
        ReachedLimitLevel: seed,
        ActionName: seed.toString(),
        ProceededBy: seed.toString(),
        ModifiedDate: new Date(2017, 0, seed % 31)
    };
}
