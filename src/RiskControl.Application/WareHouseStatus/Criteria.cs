using Fanex.Data.Repository;

namespace RiskControl.Application.WareHouseStatus;

public class Criteria : CriteriaBase
{
    public Criteria()
    {
        Cube = "DW";
    }

    public string Cube { get; }

    public override bool IsValid() => true;

    public override string GetSettingKey() => "BI_GetDWStatusByCube";
}