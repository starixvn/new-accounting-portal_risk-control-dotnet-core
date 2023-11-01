using System.IO;
using RiskControl.Configuration;

namespace RiskControl.WinLossLimitControl.FileDownload;

public interface FileContentService
{
    byte[] ReadAllBytes(string filename);
}

public class FileContentServiceImp : FileContentService
{
    private readonly ConfigurationService configurationService;

    public FileContentServiceImp(ConfigurationService configurationService)
    {
        this.configurationService = configurationService;
    }

    public byte[] ReadAllBytes(string filename)
    {
        var filePath = $"{configurationService.FileServerDirectory}/{filename}";
        return File.ReadAllBytes(filePath);
    }
}