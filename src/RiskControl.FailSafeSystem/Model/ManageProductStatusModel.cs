using RiskControl.FailSafeSystem.Constants;

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

    public string UmStatus { get; set; }
}

public class GroupedManageProductStatusModel
{
    public int ProductId { get; set; }

    public IEnumerable<ManageProductStatusModel> Items { get; set; }

    public string Status => Items.Any(x => x.Status == StatusConstants.Disabled)
        ? StatusConstants.Disabled
        : StatusConstants.Enabled;

    public DateTime? LastUpdated => Items.Max(i => i.LastUpdated);
}