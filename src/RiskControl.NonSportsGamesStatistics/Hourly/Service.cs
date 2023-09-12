using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using RiskControl.NonSportsGamesStatistics.Common;
using RiskControl.NonSportsGamesStatistics.Model;
using RiskControl.NonSportsGamesStatistics.RawData;

namespace RiskControl.NonSportsGamesStatistics.Hourly;

public interface Service
{
    Task<HourlyReportModel> CalculateHourlyReport(BaseStatisticCriteria criteria, DateTime winlostDate);
}

public class ServiceImp : Service
{
    private readonly RawService rawService;

    private readonly IMapper mapper;

    public ServiceImp(RawService rawService, IMapper mapper)
    {
        this.rawService = rawService;
        this.mapper = mapper;
    }

    public HourlyRawStatistics SumRawData(IEnumerable<HourlyRawStatistics> rawData)
    {
        return new HourlyRawStatistics
        {
            BetCount = rawData.Sum(x => x.BetCount),
            TotalBets = rawData.Sum(x => x.TotalBets),
            TotalWins = rawData.Sum(x => x.TotalWins),
            TotalRefund = rawData.Sum(x => x.TotalRefund),
            HouseTurnover = rawData.Sum(x => x.HouseTurnover),
            RealTurnover = rawData.Sum(x => x.RealTurnover),
            HouseGrossIncome = rawData.Sum(x => x.HouseGrossIncome),
            HouseComm = rawData.Sum(x => x.HouseComm),
            ExtraPT = rawData.Sum(x => x.ExtraPT)
        };
    }

    public HourlyRawStatistics CalculateAccumulatedStatisticsToCurrentHour(List<HourlyRawStatistics> rawData, HourlyRawStatistics item)
    {
        var itemIndex = rawData.FindIndex(x => x.ReportBy == item.ReportBy);

        var rawAccumulated = SumRawData(rawData.Take(itemIndex + 1));
        rawAccumulated.ReportBy = item.ReportBy;
        rawAccumulated.NoOfPlayers = item.NoOfPlayers;
        rawAccumulated.Currency = item.Currency;

        return rawAccumulated;
    }

    public List<HourlyRawStatistics> CalculateAccumulated(List<HourlyRawStatistics> rawData)
    {
        var result = new List<HourlyRawStatistics>();
        rawData.ForEach(
            item =>
            {
                if (item.BetCount.HasValue)
                {
                    var accumulatedStatistics = CalculateAccumulatedStatisticsToCurrentHour(rawData, item);
                    result.Add(accumulatedStatistics);
                }
                else
                {
                    result.Add(item);
                }
            });

        return result;
    }

    public HourlyStatisticsAccumulatedModel CalculateHourlyStatisticsAccumulated(List<HourlyRawStatistics> rawData)
    {
        var accumulated = CalculateAccumulated(rawData);

        var hourlyStatisticsAccumulated = mapper.Map<List<HourlyStatistics>>(accumulated);

        var averagePlayer = CalculateAveragePlayer(rawData);

        return new HourlyStatisticsAccumulatedModel
        {
            HourlyStatistics = hourlyStatisticsAccumulated,
            AveragePlayer = averagePlayer
        };
    }

    private static double? CalculateAveragePlayer(IEnumerable<HourlyRawStatistics> rawData)
    {
        return rawData.Average(x => x.NoOfPlayers);
    }

    public async Task<HourlyReportModel> CalculateHourlyReport(BaseStatisticCriteria criteria, DateTime winlostDate)
    {
        var rawData = await rawService.QueryData<HourlyRawStatistics>(criteria, winlostDate).ConfigureAwait(false);

        return new HourlyReportModel
        {
            HourlyStatisticAccumulated = CalculateHourlyStatisticsAccumulated(rawData.ToList()),
            HourlyStatistics = mapper.Map<List<HourlyStatistics>>(rawData)
        };
    }
}