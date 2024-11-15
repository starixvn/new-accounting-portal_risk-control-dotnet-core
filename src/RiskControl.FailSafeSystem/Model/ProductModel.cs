namespace RiskControl.FailSafeSystem.Model;

public class ProductModel
{
    public int ProductId { get; set; }

    public string ProductName { get; set; }

    public bool Checked { get; set; } = true;
}