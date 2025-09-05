namespace RiskControl.FailSafeSystem.Model;

public class ProductStatusHistoryModel
{
    public DateTime InsertDate { get; set; }

    public string ActionType { get; set; }

    public string ProceededBy { get; set; }
}