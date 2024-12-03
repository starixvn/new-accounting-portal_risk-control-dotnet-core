namespace RiskControl.WinLossLimitControl.Monitor.FileDownload;

public class ApiResultModel
{
    public string FileName { get; set; }

    public byte[] FileContent { get; set; }

    public string InvalidUsernames { get; set; }

    public string Guid { get; set; }
}