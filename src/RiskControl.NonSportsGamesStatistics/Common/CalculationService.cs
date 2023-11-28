using System.Collections.Generic;
using System.Linq;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.Common;

public interface CalculationService
{
    DailyViewGroupStatisticsModel CalculateDailyViewStatisticsForPerGroup(string groupId, string groupName,
        IEnumerable<BaseRawStatistic> rawData);

    List<DailyViewGroupStatisticsModel> CalculateDailyViewStatisticsGroup(
        IEnumerable<BaseRawStatistic> rawData);

    List<DailyGroupStatisticsModel> CalculateDailyStatisticsGroup(IEnumerable<BaseRawStatistic> rawData);

    DailyViewStatisticsModel CalculateDailyViewBaseCurrencyGrandTotal(BaseRawStatistic rawData);

    List<DailyViewGroupStatisticsWithTotalModel> CalculateCompanyStatisticsGroup(
        GenericRawData<CompanyRawStatistics> rawData);

    DailyViewGroupStatisticsWithTotalModel CalculateGroupStatisticWithTotal(
        IEnumerable<BaseRawStatistic> rawData, BaseRawStatistic total);

    UserNameViewStatisticsModel CalculateUserNameViewBaseCurrencyGrandTotal(UserNameViewRawStatistics rawData);

    List<DailyViewGroupStatisticsWithTotalModel> CalculateDeviceStatisticGroup(
        GenericRawData<BaseRawStatistic> rawData);

    List<UserNameViewGroupStatisticsModel> CalculateUserNameViewStatisticGroup(
        IEnumerable<UserNameViewRawStatistics> rawData);

    UserNameViewGroupStatisticsModel CalculateUserNameViewStatisticForPerGroup(string groupId, string groupName,
        IEnumerable<UserNameViewRawStatistics> rawData);

    UserNameViewGroupStatisticsWithTotalModel CalculateUserNameViewGroupStatisticWithTotal(
        IEnumerable<UserNameViewRawStatistics> rawData,
        UserNameViewRawStatistics total);

    List<UserNameViewGroupStatisticsWithTotalModel> CalculateTopTwentyStatisticGroup(
        GenericRawData<TopTwentyRawStatistics> rawData);

    CurrencyViewStatisticsReportModel CalculateCurrencyViewReport(GenericRawData<BaseRawStatistic> rawData);

    CurrencyViewStatisticsReportModel CalculateGrandTotalForDailyAndCurrencyView(
        GenericRawData<BaseRawStatistic> rawData);

    DailyReportModel CalculateDailyReport(GenericRawData<BaseRawStatistic> rawData);

    DailyViewGroupStatisticWithTotalReportModel CalculateDeviceReport(GenericRawData<BaseRawStatistic> rawData);

    DailyViewGroupStatisticWithTotalReportModel CalculateCompanyReport(GenericRawData<CompanyRawStatistics> rawData);

    DailyViewReportModel CalculateDailyViewReport(GenericRawData<BaseRawStatistic> rawData);

    UserNameViewGroupStatisticsWithTotalModel CalculateTopTwentyGroupReport(
        GenericRawData<TopTwentyRawStatistics> rawData);

    UserNameViewReportModel CalculateUserNameViewReport(GenericRawData<UserNameViewRawStatistics> rawData);

    UserNameViewReportModel CalculateUserNameViewGrandTotal(GenericRawData<UserNameViewRawStatistics> rawData);

    BaseRawStatistic CalculateSum(IEnumerable<BaseRawStatistic> baseRawStatistics);
}

public class CalculationServiceImp(IMapper mapper) : CalculationService
{
    public List<DailyViewGroupStatisticsModel> CalculateDailyViewStatisticsGroup(
        IEnumerable<BaseRawStatistic> rawData)
    {
        var groups = rawData.GroupBy(x => new { x.ReportBy, x.ReportById });
        var result = from @group in groups
            let reportByGroup =
                rawData.Where(x => x.ReportBy == @group.Key.ReportBy && x.ReportById == @group.Key.ReportById)
            select
                CalculateDailyViewStatisticsForPerGroup(@group.Key.ReportById, @group.Key.ReportBy, reportByGroup);
        return result.ToList();
    }

    public DailyViewGroupStatisticsModel CalculateDailyViewStatisticsForPerGroup(string groupId, string groupName,
        IEnumerable<BaseRawStatistic> rawData)
    {
        var statistics = mapper.Map<List<DailyViewStatisticsModel>>(rawData);
        return new DailyViewGroupStatisticsModel
        {
            GroupId = groupId,
            GroupName = groupName,
            DailyViewStatistics = statistics
        };
    }

    public DailyViewStatisticsModel CalculateDailyViewBaseCurrencyGrandTotal(BaseRawStatistic rawData)
    {
        var grandTotal = mapper.Map<DailyViewStatisticsModel>(rawData);
        grandTotal.ReportBy = "Grand Total RM";
        return grandTotal;
    }

    public List<DailyViewGroupStatisticsWithTotalModel> CalculateCompanyStatisticsGroup(
        GenericRawData<CompanyRawStatistics> rawData)
    {
        var groups = new List<DailyViewGroupStatisticsWithTotalModel>();

        if (!rawData.RawStatistics.Any())
        {
            return groups;
        }

        var creditTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "Credit Group");
        var creditRawData = rawData.RawStatistics.Where(x => !x.IsDeposit);
        var depositTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "Licensee Group");
        var depositRawData = rawData.RawStatistics.Where(x => x.IsDeposit);

        if (creditRawData.Any())
        {
            var creditGroup = CalculateGroupStatisticWithTotal(creditRawData, creditTotal);
            groups.Add(creditGroup);
        }

        if (depositRawData.Any())
        {
            var depositGroup = CalculateGroupStatisticWithTotal(depositRawData, depositTotal);
            groups.Add(depositGroup);
        }

        return groups;
    }

    public DailyViewGroupStatisticsWithTotalModel CalculateGroupStatisticWithTotal(
        IEnumerable<BaseRawStatistic> rawData, BaseRawStatistic total)
    {
        return new DailyViewGroupStatisticsWithTotalModel
        {
            Statistics = CalculateDailyViewStatisticsGroup(rawData),
            Total = mapper.Map<DailyViewStatisticsModel>(total)
        };
    }

    public List<DailyGroupStatisticsModel> CalculateDailyStatisticsGroup(IEnumerable<BaseRawStatistic> rawData)
    {
        var groups = rawData.GroupBy(x => x.ReportBy);
        var result = from @group in groups
            let reportByGroup = rawData.Where(x => x.ReportBy == @group.Key)
            select CalculateDailyStatisticForPerGroup(@group.Key, reportByGroup);
        return result.ToList();
    }

    public UserNameViewStatisticsModel CalculateUserNameViewBaseCurrencyGrandTotal(UserNameViewRawStatistics rawData)
    {
        var grandTotal = mapper.Map<UserNameViewStatisticsModel>(rawData);
        grandTotal.ReportBy = "Grand Total RM";
        return grandTotal;
    }

    public List<DailyViewGroupStatisticsWithTotalModel> CalculateDeviceStatisticGroup(
        GenericRawData<BaseRawStatistic> rawData)
    {
        var groups = new List<DailyViewGroupStatisticsWithTotalModel>();

        if (!rawData.RawStatistics.Any())
        {
            return groups;
        }

        var mobileTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "Mobile");
        var mobileRawData = rawData.RawStatistics.Where(x => x.ReportById == "Mobile");
        var noneMobileTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "Non-mobile");
        var noneMobileRawData = rawData.RawStatistics.Where(x => x.ReportById == "Non-mobile");
        var uncategorizedTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "Uncategorized");
        var uncategorizedRawData = rawData.RawStatistics.Where(x => x.ReportById == "Uncategorized");

        if (mobileRawData.Any())
        {
            var mobileGroup = CalculateGroupStatisticWithTotal(mobileRawData, mobileTotal);
            groups.Add(mobileGroup);
        }

        if (noneMobileRawData.Any())
        {
            var noneMobileGroup = CalculateGroupStatisticWithTotal(noneMobileRawData, noneMobileTotal);
            groups.Add(noneMobileGroup);
        }

        if (uncategorizedRawData.Any())
        {
            var uncategorizedGroup = CalculateGroupStatisticWithTotal(uncategorizedRawData, uncategorizedTotal);
            groups.Add(uncategorizedGroup);
        }

        return groups;
    }

    public List<UserNameViewGroupStatisticsModel> CalculateUserNameViewStatisticGroup(
        IEnumerable<UserNameViewRawStatistics> rawData)
    {
        var groups = rawData.GroupBy(x => new { x.ReportBy, x.ReportById });
        var result = from @group in groups
            let reportByGroup =
                rawData.Where(x => x.ReportBy == @group.Key.ReportBy && x.ReportById == @group.Key.ReportById)
            select
                CalculateUserNameViewStatisticForPerGroup(@group.Key.ReportById, @group.Key.ReportBy, reportByGroup);
        return result.ToList();
    }

    public UserNameViewGroupStatisticsModel CalculateUserNameViewStatisticForPerGroup(
        string groupId,
        string groupName,
        IEnumerable<UserNameViewRawStatistics> rawData)
    {
        var statistics = mapper.Map<List<UserNameViewStatisticsModel>>(rawData);
        return new UserNameViewGroupStatisticsModel
        {
            GroupId = groupId,
            GroupName = groupName,
            UserNameViewStatistics = statistics
        };
    }

    public UserNameViewGroupStatisticsWithTotalModel CalculateUserNameViewGroupStatisticWithTotal(
        IEnumerable<UserNameViewRawStatistics> rawData,
        UserNameViewRawStatistics total)
    {
        return new UserNameViewGroupStatisticsWithTotalModel
        {
            Statistics = CalculateUserNameViewStatisticGroup(rawData),
            Total = mapper.Map<UserNameViewStatisticsModel>(total)
        };
    }

    public List<UserNameViewGroupStatisticsWithTotalModel> CalculateTopTwentyStatisticGroup(
        GenericRawData<TopTwentyRawStatistics> rawData)
    {
        const string TopTwenty = "Top 20";
        const string BottomTwenty = "Bottom 20";
        var groups = new List<UserNameViewGroupStatisticsWithTotalModel>();

        if (!rawData.RawStatistics.Any())
        {
            return groups;
        }

        var topTwentyTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == TopTwenty);
        var topTwentyRawData = rawData.RawStatistics.Where(x => x.TopType == TopTwenty);
        var bottomTwentyTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == BottomTwenty);
        var bottomTwentyRawData = rawData.RawStatistics.Where(x => x.TopType == BottomTwenty);

        if (topTwentyRawData.Any())
        {
            var topTwentyGroup = CalculateUserNameViewGroupStatisticWithTotal(topTwentyRawData, topTwentyTotal);
            groups.Add(topTwentyGroup);
        }

        if (bottomTwentyRawData.Any())
        {
            var bottomTwentyGroup = CalculateUserNameViewGroupStatisticWithTotal(bottomTwentyRawData,
                bottomTwentyTotal);
            groups.Add(bottomTwentyGroup);
        }

        return groups;
    }

    public CurrencyViewStatisticsReportModel CalculateCurrencyViewReport(
        GenericRawData<BaseRawStatistic> rawData)
    {
        var reportModel = new CurrencyViewStatisticsReportModel();

        if (!rawData.RawStatistics.Any())
        {
            return reportModel;
        }

        reportModel.Statistics = mapper.Map<List<DailyViewStatisticsModel>>(rawData.RawStatistics);
        reportModel.GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault());

        return reportModel;
    }

    public CurrencyViewStatisticsReportModel CalculateGrandTotalForDailyAndCurrencyView(
        GenericRawData<BaseRawStatistic> rawData)
    {
        var reportModel = new CurrencyViewStatisticsReportModel();

        if (!rawData.RawStatistics.Any())
        {
            return reportModel;
        }

        var statistics = rawData.RawStatistics.Select(item =>
        {
            item.ReportBy = $"Total {item.Currency}";
            return mapper.Map<DailyViewStatisticsModel>(item);
        }).ToList();

        reportModel.Statistics = statistics;
        reportModel.GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault());

        return reportModel;
    }

    public DailyReportModel CalculateDailyReport(GenericRawData<BaseRawStatistic> rawData)
    {
        return new DailyReportModel
        {
            Statistics = CalculateDailyStatisticsGroup(rawData.RawStatistics),
            GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault())
        };
    }

    public DailyViewGroupStatisticWithTotalReportModel CalculateDeviceReport(
        GenericRawData<BaseRawStatistic> rawData)
    {
        var grandTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "GrandTotalRM");
        return new DailyViewGroupStatisticWithTotalReportModel
        {
            GroupStatisticWithTotal = CalculateDeviceStatisticGroup(rawData),
            GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(grandTotal)
        };
    }

    public DailyViewGroupStatisticWithTotalReportModel CalculateCompanyReport(
        GenericRawData<CompanyRawStatistics> rawData)
    {
        var grandTotal = rawData.Total.FirstOrDefault(x => x.ReportBy == "GrandTotalRM");
        return new DailyViewGroupStatisticWithTotalReportModel
        {
            GroupStatisticWithTotal = CalculateCompanyStatisticsGroup(rawData),
            GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(grandTotal)
        };
    }

    public DailyViewReportModel CalculateDailyViewReport(GenericRawData<BaseRawStatistic> rawData)
    {
        return new DailyViewReportModel
        {
            Statistics = CalculateDailyViewStatisticsGroup(rawData.RawStatistics),
            GrandTotal = CalculateDailyViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault())
        };
    }

    public UserNameViewGroupStatisticsWithTotalModel CalculateTopTwentyGroupReport(
        GenericRawData<TopTwentyRawStatistics> rawData)
    {
        return new UserNameViewGroupStatisticsWithTotalModel
        {
            Statistics = CalculateUserNameViewStatisticGroup(rawData.RawStatistics),
            Total = CalculateUserNameViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault())
        };
    }

    public UserNameViewReportModel CalculateUserNameViewReport(GenericRawData<UserNameViewRawStatistics> rawData)
    {
        return new UserNameViewReportModel
        {
            Statistics = mapper.Map<List<UserNameViewStatisticsModel>>(rawData.RawStatistics),
            GrandTotal = CalculateUserNameViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault())
        };
    }

    public UserNameViewReportModel CalculateUserNameViewGrandTotal(GenericRawData<UserNameViewRawStatistics> rawData)
    {
        var statistics = rawData.RawStatistics.Select(item =>
        {
            item.ReportBy = $"Total {item.Currency}";
            return mapper.Map<UserNameViewStatisticsModel>(item);
        }).ToList();

        return new UserNameViewReportModel
        {
            Statistics = statistics,
            GrandTotal = CalculateUserNameViewBaseCurrencyGrandTotal(rawData.Total.FirstOrDefault())
        };
    }

    public DailyGroupStatisticsModel CalculateDailyStatisticForPerGroup(string groupName,
        IEnumerable<BaseRawStatistic> rawData)
    {
        var statistics = mapper.Map<List<DailyStatisticModel>>(rawData);
        return new DailyGroupStatisticsModel
        {
            GroupName = groupName,
            DailyStatistics = statistics
        };
    }

    public BaseRawStatistic CalculateSum(IEnumerable<BaseRawStatistic> baseRawStatistics)
    {
        return new BaseRawStatistic
        {
            ReportBy = baseRawStatistics.FirstOrDefault().ReportBy,
            ReportById = baseRawStatistics.FirstOrDefault().ReportById,
            CurrencyId = baseRawStatistics.FirstOrDefault().CurrencyId,
            Currency = baseRawStatistics.FirstOrDefault().Currency,
            BetCount = baseRawStatistics.Sum(x => x.BetCount),
            TotalBets = baseRawStatistics.Sum(x => x.TotalBets),
            TotalWins = baseRawStatistics.Sum(x => x.TotalWins),
            TotalRefund = baseRawStatistics.Sum(x => x.TotalRefund),
            HouseTurnover = baseRawStatistics.Sum(x => x.HouseTurnover),
            RealTurnover = baseRawStatistics.Sum(x => x.RealTurnover),
            HouseGrossIncome = baseRawStatistics.Sum(x => x.HouseGrossIncome),
            HouseComm = baseRawStatistics.Sum(x => x.HouseComm),
            ExtraPT = baseRawStatistics.Sum(x => x.ExtraPT)
        };
    }
}