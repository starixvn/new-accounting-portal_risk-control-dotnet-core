namespace RiskControl.FailSafeSystem.Model;

public class AutoDisableProductModel
{
    public string UserName { get; set; }

    public DateTime ActionDate { get; set; }

    public bool IsAutoDisableProduct { get; set; }

    public string Description { get; set; }
}