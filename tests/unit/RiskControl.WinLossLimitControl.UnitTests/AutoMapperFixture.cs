using System;
using System.Threading;
using AutoMapper;
using RiskControl.WinLossLimitControl;

public class AutoMapperFixture {

    private static int initialized = 0;

    public AutoMapperFixture () {

        if (0 == Interlocked.Exchange (ref initialized, 1)) {
            Mapper.Initialize (cfg => {
                cfg.InitializeWinLossLimitControl ();
            });
            Console.WriteLine("Initialzed AutoMapper");
        }
    }
}