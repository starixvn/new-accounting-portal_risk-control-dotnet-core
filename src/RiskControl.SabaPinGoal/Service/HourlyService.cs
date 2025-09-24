using AutoMapper;
using Fanex.Data.Repository;
using RiskControl.SabaPinGoal.Criteria;
using RiskControl.SabaPinGoal.Model;

namespace RiskControl.SabaPinGoal.Service;

public interface HourlyService
{
    Task<HourlyReportModel> CalculateHourlyReport(QueryModel queryModel);
}

public class HourlyServiceImp(IDynamicRepository repository, IMapper mapper) : HourlyService
{
    public async Task<HourlyReportModel> CalculateHourlyReport(QueryModel queryModel)
    {
        var criteria = mapper.Map<HourlyCriteria>(queryModel);
        var rawData = await repository.FetchAsync<HourlyRawStatistics>(criteria);

        return new HourlyReportModel
        {
            HourlyStatisticAccumulated = CalculateHourlyStatisticsAccumulated(rawData.ToList()),
            HourlyStatistics = mapper.Map<List<HourlyStatistics>>(rawData)
        };
    }

    private HourlyStatisticsAccumulatedModel CalculateHourlyStatisticsAccumulated(List<HourlyRawStatistics> rawData)
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

    private List<HourlyRawStatistics> CalculateAccumulated(List<HourlyRawStatistics> rawData)
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

    private HourlyRawStatistics CalculateAccumulatedStatisticsToCurrentHour(List<HourlyRawStatistics> rawData, HourlyRawStatistics item)
    {
        var itemIndex = rawData.FindIndex(x => x.ReportBy == item.ReportBy);

        var rawAccumulated = SumRawData(rawData.Take(itemIndex + 1));
        rawAccumulated.ReportBy = item.ReportBy;
        rawAccumulated.NoOfPlayers = item.NoOfPlayers;
        rawAccumulated.Currency = item.Currency;

        return rawAccumulated;
    }

    private HourlyRawStatistics SumRawData(IEnumerable<HourlyRawStatistics> rawData)
    {
        return new HourlyRawStatistics
        {
            BetCount = rawData.Sum(x => x.BetCount),
            TotalBets = rawData.Sum(x => x.TotalBets),
            TotalWins = rawData.Sum(x => x.TotalWins),
            HouseTurnover = rawData.Sum(x => x.HouseTurnover),
            HouseGrossIncome = rawData.Sum(x => x.HouseGrossIncome),
            HouseComm = rawData.Sum(x => x.HouseComm),
            ExtraPT = rawData.Sum(x => x.ExtraPT)
        };
    }

    private static double? CalculateAveragePlayer(IEnumerable<HourlyRawStatistics> rawData)
    {
        return rawData.Average(x => x.NoOfPlayers);
    }
}