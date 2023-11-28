using System.Collections.Generic;
using System.IO;
using System.Linq;
using Epplus.Mapper.Extensions;
using OfficeOpenXml;
using RiskControl.Configuration;

namespace RiskControl.ProgressiveJackpot;

public interface ExcelBuilder
{
    ExcelPackage Build<T>(string template, IEnumerable<T> models);
}

public class ExcelBuilderImp(ConfigurationService configurationService) : ExcelBuilder
{
    private const int StartRowIndex = 5;

    public ExcelPackage Build<T>(string template, IEnumerable<T> models)
    {
        var excelPackage = LoadTemplate(template);
        var sheet = excelPackage.Workbook.Worksheets.First();
        sheet.ApplyVertical(models, StartRowIndex);

        return excelPackage;
    }

    private ExcelPackage LoadTemplate(string template)
    {
        var templateAbsolutelyPath = $"{configurationService.CurrentDirectory}/Templates/ProgressiveJackpot/{template}.xlsx";
        using var stream = new FileStream(templateAbsolutelyPath, FileMode.Open, FileAccess.Read);
        var excelPackage = new ExcelPackage(stream);
        return excelPackage;
    }
}