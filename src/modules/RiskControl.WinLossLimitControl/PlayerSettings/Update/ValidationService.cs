using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Fanex.Data.Repository;
using RiskControl.WinLossLimitControl.Constants;
using RiskControl.WinLossLimitControl.Services;

namespace RiskControl.WinLossLimitControl.PlayerSettings.Update
{
    public interface ValidationService
    {
        Task<bool> Execute(Request request);

        Task<bool> CheckWinContrains(Request request);

        Task<bool> CheckLossContrains(Request request);
    }

    public class ValidationServiceImp : ValidationService
    {
        private readonly IDynamicRepository repository;

        private readonly IncreamentedSeriesContrainService increamentedSeriesContrainService;

        public ValidationServiceImp(IDynamicRepository repository, IncreamentedSeriesContrainService increamentedSeriesContrainService)
        {
            this.repository = repository;
            this.increamentedSeriesContrainService = increamentedSeriesContrainService;
        }

        public async Task<bool> Execute(Request request)
        {
            var winLimit = request.Limit;
            if (winLimit == 0)
            {
                return true;
            }

            var isValid = LimitLevelConstant.IsWinLimitLevel(request.LevelId)
                ? await CheckWinContrains(request).ConfigureAwait(false)
                : await CheckLossContrains(request).ConfigureAwait(false);

            return isValid;
        }

        private async Task<IEnumerable<PlayerSetting>> GetPlayerSettings(int custId, int productId, int groupId)
        {
            var criteria = new ReadCriteria
            {
                CustId = custId,
                GroupId = groupId,
                ProductId = productId
            };

            return await repository.FetchAsync<PlayerSetting>(criteria).ConfigureAwait(false);
        }

        public async Task<bool> CheckWinContrains(Request request)
        {
            var playerSettings = await GetPlayerSettings(request.CustId, request.ProductId, request.GroupId).ConfigureAwait(false);
            var limits = playerSettings.Where(p => LimitLevelConstant.IsWinLimitLevel(p.LevelId))
                                    .OrderBy(p => p.LevelId)
                                    .Select(p => p.MaxWinLimit)
                                    .ToArray();
            limits[request.LevelId - 1] = request.Limit;
            return increamentedSeriesContrainService.IsPositiveIncreamented(limits);
        }

        public async Task<bool> CheckLossContrains(Request request)
        {
            var playerSettings = await GetPlayerSettings(request.CustId, request.ProductId, request.GroupId).ConfigureAwait(false);
            var limits = playerSettings.Where(p => LimitLevelConstant.IsLossLimitLevel(p.LevelId))
                                     .OrderByDescending(p => p.LevelId)
                                     .Select(p => p.MaxWinLimit)
                                     .ToArray();
            limits[LimitLevelConstant.BlackLevel - request.LevelId] = request.Limit;

            return increamentedSeriesContrainService.IsNegativeIncreamented(limits);
        }
    }
}