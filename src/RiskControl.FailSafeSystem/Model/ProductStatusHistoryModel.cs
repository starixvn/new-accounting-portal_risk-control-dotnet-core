namespace RiskControl.FailSafeSystem.Model;

public class ProductStatusHistoryModel
{
    public DateTime Date { get; set; }

    public string ProductName { get; set; }

    public bool Status { get; set; }

    public string ProceededBy { get; set; }
}