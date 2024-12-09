namespace RiskControl.FailSafeSystem.Model;

public class SettingViewModel : SettingRuleModel
{
    public string GameIncome { get; set; }

    public string GamePayout { get; set; }

    public string[] ProductList { get; set; }
}