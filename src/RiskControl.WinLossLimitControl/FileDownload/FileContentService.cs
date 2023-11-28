using System.IO;
using RiskControl.Configuration;

namespace RiskControl.WinLossLimitControl.FileDownload;

public interface FileContentService
{
    byte[] ReadAllBytes(string filename);
}

public class FileContentServiceImp(ConfigurationService configurationService) : FileContentService
{
    public byte[] ReadAllBytes(string filename)
    {
        var filePath = $"{configurationService.FileServerDirectory}/{filename}";
        return File.ReadAllBytes(filePath);
    }
}