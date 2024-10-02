using System;

namespace RiskControl.WinLossLimitControl.Monitor.FileDownload;

public class MemberWLDownloadFileModel
{
    public string ProductIdList { get; set; }

    public string UsernameList { get; set; }

    public DateTime FromDate { get; set; }

    public DateTime ToDate { get; set; }
}