using System;
using AutoMapper;

public class AutoMapperFixture
{
    public AutoMapperFixture()
    {
        Mapper.Initialize(cfg => cfg.CreateMissingTypeMaps = true);
    }
}