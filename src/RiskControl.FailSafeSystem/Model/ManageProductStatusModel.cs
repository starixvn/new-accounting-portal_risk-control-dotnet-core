namespace RiskControl.FailSafeSystem.Model;

public class ManageProductStatusModel
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public int SportType { get; set; }

    public string SportName { get; set; }

    public DateTime? LastUpdated { get; set; }

    public string LastActionType { get; set; }

    public string LastAPIResponseMessage { get; set; }

    public string Status { get; set; }
}