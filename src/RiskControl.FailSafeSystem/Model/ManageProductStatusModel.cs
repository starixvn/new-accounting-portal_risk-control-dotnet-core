namespace RiskControl.FailSafeSystem.Model;

public class ManageProductStatusModel
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public DateTime? LastUpdated { get; set; }

    public bool Status { get; set; }
}