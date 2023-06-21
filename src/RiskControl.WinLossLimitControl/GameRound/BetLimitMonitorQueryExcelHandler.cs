using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Epplus.Mapper.Extensions;
using MediatR;
using OfficeOpenXml;
using RiskControl.Core.Configuration;
using RiskControl.WinLossLimitControl.GameRound.Criteria;
using RiskControl.WinLossLimitControl.GameRound.Request;

namespace RiskControl.WinLossLimitControl.GameRound
{
    public class BetLimitMonitorQueryExcelHandler : IRequestHandler<BetLimitMonitorQueryExcelRequest, ExcelPackage>
    {
        private const int ExcelStartRow = 5;

        private readonly ConfigurationService configurationService;

        private readonly BetLimitMonitorDataService betLimitMonitorDataService;

        private readonly IMapper mapper;

        public BetLimitMonitorQueryExcelHandler(BetLimitMonitorDataService betLimitMonitorDataService, ConfigurationService configurationService, IMapper mapper)
        {
            this.betLimitMonitorDataService = betLimitMonitorDataService;
            this.configurationService = configurationService;
            this.mapper = mapper;
        }

        public async Task<ExcelPackage> Handle(BetLimitMonitorQueryExcelRequest request, CancellationToken cancellationToken)
        {
            var criteria = mapper.Map<BetLimitMonitorQueryCriteria>(request);
            var models = await betLimitMonitorDataService.Query(criteria);
            var excelPackage = LoadTemplate();
            var sheet = excelPackage.Workbook.Worksheets.First();
            sheet.ApplyVertical(models, ExcelStartRow);

            return excelPackage;
        }

        private ExcelPackage LoadTemplate()
        {
            var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/Templates/GameRound/Monitor.xlsx";
            using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read);
            var excelPackage = new ExcelPackage(stream);
            return excelPackage;
        }
    }
}
