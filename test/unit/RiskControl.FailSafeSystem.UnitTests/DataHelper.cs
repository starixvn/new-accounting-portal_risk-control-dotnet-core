using RiskControl.FailSafeSystem.Model;

namespace RiskControl.FailSafeSystem.UnitTests;

public static class DataHelper
{
    public static IEnumerable<RuleTitleModel> GetRuleTitle => new List<RuleTitleModel>
    {
        new()
        {
            Checked = true,
            ConstantKey = 67,
            RuleTitle = "Rea FACHAI"
        },
        new()
        {
            Checked = true,
            ConstantKey = 1,
            RuleTitle = "RNG Protection - 1"
        }
    };

    public static IEnumerable<ProductModel> GetProducts => new List<ProductModel>
    {
        new()
        {
            Checked = true,
            ProductId = 67,
            ProductName = "AdvantPlay"
        },
        new()
        {
            Checked = true,
            ProductId = 68,
            ProductName = "AdvantPlay Mini"
        }
    };

    public static IEnumerable<SettingRuleModel> GetSettingRules => new List<SettingRuleModel>
    {
        new()
        {
            ConstantKey = 67,
            EnableLetstalk = true,
            IsTest = false,
            ProductCount = 1,
            RuleMemberLimit = 1,
            RuleTitle = "Rea FACHAI"
        },
        new()
        {
            ConstantKey = 66,
            EnableLetstalk = true,
            IsTest = true,
            ProductCount = 1,
            RuleMemberLimit = 1,
            RuleTitle = "Test FACHAI"
        }
    };

    public static IEnumerable<SettingCriteriaModel> GetSettingCriteria => new List<SettingCriteriaModel>
    {
        new()
        {
            ConstantKey = 67,
            CriteriaId = 1,
            CriteriaValue = "10"
        },
        new()
        {
            ConstantKey = 67,
            CriteriaId = 2,
            CriteriaValue = "1"
        },
        new()
        {
            ConstantKey = 66,
            CriteriaId = 1,
            CriteriaValue = "100"
        }
    };

    public static IEnumerable<SettingProductModel> GetSettingProducts => new List<SettingProductModel>
    {
        new()
        {
            ConstantKey = 67,
            ProductId = 1,
            ProductName = "FA CHAI"
        },
        new()
        {
            ConstantKey = 66,
            ProductId = 1,
            ProductName = "FA CHAI"
        }
    };

    public static IEnumerable<MonitorModel> GetMonitors => new List<MonitorModel>
    {
        new()
        {
            RuleTitle = "Rea FACHAI",
            EnableLetstalk = true,
            GameTypeName = "Bao Chuan Fishing",
            Members = "12BETRMB012108",
            ProductName = "FA CHAI",
            RuleMemberLimit = 1,
            ReachedTime = new DateTime(),
            RuleId = 217,
            ReachedRule = string.Empty
        },
        new()
        {
            RuleTitle = "Rule for Product 72,75,100",
            EnableLetstalk = true,
            GameTypeName = "Fortune Gems",
            Members = "12BETRM013132",
            ProductName = "Jili",
            RuleMemberLimit = 1,
            ReachedTime = new DateTime(),
            RuleId = 60,
            ReachedRule = string.Empty
        }
    };

    public static IEnumerable<MonitorCriteriaModel> GetMonitorCriteria => new List<MonitorCriteriaModel>
    {
        new()
        {
            RuleId = 217,
            CriteriaValue = "10",
            PostFix = "RM"
        },
        new()
        {
            RuleId = 217,
            CriteriaValue = "1",
            PostFix = "%"
        }
    };
}