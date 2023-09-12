using System;

namespace RiskControl.WinLossLimitControl.Models;

[Serializable]
public class BaseEntity
{
    public int Id { get; set; }

    public string Name { get; set; }
}