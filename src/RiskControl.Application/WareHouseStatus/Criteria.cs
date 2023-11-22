using Fanex.Data.Repository;

namespace RiskControl.Application.WareHouseStatus;

public class Criteria : CriteriaBase
{
    public string Cube => "DW";

    public override bool IsValid() => true;

    public override string GetSettingKey() => "BI_GetDWStatusByCube";
}