using AutoMapper;
using Epplus.Mapper.Extensions;
using Fanex.Data.Repository;
using MediatR;
using OfficeOpenXml;
using RiskControl.Configuration;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.Filter;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace RiskControl.WinLossLimitControl.Monitor.Search;

public class ExcelHandler(IDynamicRepository repository,
    CacheRefService cacheRefService,
    IMapper mapper,
    ConfigurationService configurationService)
    : IRequestHandler<ExcelRequest, ExcelPackage>
{
    private const int ExcelStartRow = 2;

    public async Task<ExcelPackage> Handle(ExcelRequest request, CancellationToken cancellationToken)
    {
        var criteria = mapper.Map<MonitorSearchCriteria>(request);
        criteria.ToDate = criteria.ToDate.AddDays(1).AddSeconds(-1);
        var rawData = await repository.FetchAsync<MonitorModelRaw>(criteria);
        var excelModels = FromRawWinLimitMonitor(rawData).ToList();
        var excelPackage = LoadTemplate();
        var sheet = excelPackage.Workbook.Worksheets.First();
        sheet.ApplyVertical(excelModels, ExcelStartRow);
        return excelPackage;
    }

    private IEnumerable<MonitorModel> FromRawWinLimitMonitor(IEnumerable<MonitorModelRaw> rawData)
    {
        return rawData.Select(item => new MonitorModel
        {
            UserName = item.UserName,
            SiteName = cacheRefService.GetSiteName(item.SiteId),
            CurrencyName = cacheRefService.GetCurrencyName(item.CurrencyId),
            ProductName = cacheRefService.GetProductName(item.ProductId),
            WinningAmount = item.TotalWinAmount,
            WinningAmountRM = item.TotalWinAmountRM,
            ReachedLimitTime = $"{item.ReachedLimitTime:MM/d/yyyy h:mm:ss tt}",
            ReachedLimitLevel = item.ReachedLimitLevel,
            GameType = item.GameType,
            WinningLosingCurrency = item.WinningLosingCurrency,
            ReachedLimitLevelText = GetLimitLevelText(item.ReachedLimitLevel)
        });
    }

    private ExcelPackage LoadTemplate()
    {
        var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/Templates/WinLossLimitMonitor/Monitor.xlsx";
        using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read);
        var excelPackage = new ExcelPackage(stream);
        return excelPackage;
    }

    private string GetLimitLevelText(int level)
    {
        return level switch
        {
            LimitLevelConstant.OrangeLevel => LimitLevelConstant.OrangeLevelText,
            LimitLevelConstant.YellowLevel => LimitLevelConstant.YellowLevelText,
            LimitLevelConstant.RedLevel => LimitLevelConstant.RedLevelText,
            LimitLevelConstant.GreyLevel => LimitLevelConstant.GreyLevelText,
            LimitLevelConstant.BlackLevel => LimitLevelConstant.BlackLevelText,
            _ => "White"
        };
    }
}