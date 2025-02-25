using MediatR;
using OfficeOpenXml;
using System;

namespace RiskControl.WinLossLimitControl.Monitor.Search;

public class ExcelRequest: IRequest<ExcelPackage>
{
    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }

    public int ProductId { get; set; }

    public string Username { get; set; }

    public string MultiSite { get; set; }

    public int CurrencyId { get; set; }

    public string LevelId { get; set; }

    public bool ExcludeTestData { get; set; }
}