namespace RiskControl.SabaPinGoal.Model;

public record GroupFilterModel(Func<BaseRawStatisticModel, bool> TotalFilter, Func<BaseRawStatisticModel, bool> DataFilter);