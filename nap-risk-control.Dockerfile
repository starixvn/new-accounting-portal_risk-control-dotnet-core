FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY ./src/RiskControl.Application ./src/RiskControl.Application
COPY ./src/RiskControl.BettingMonitoring ./src/RiskControl.BettingMonitoring
COPY ./src/RiskControl.Core ./src/RiskControl.Core
COPY ./src/RiskControl.Dashboard ./src/RiskControl.Dashboard
COPY ./src/RiskControl.NonSportsGamesStatistics ./src/RiskControl.NonSportsGamesStatistics
COPY ./src/RiskControl.ProgressiveJackpot ./src/RiskControl.ProgressiveJackpot
COPY ./src/RiskControl.WinLossLimitControl ./src/RiskControl.WinLossLimitControl
COPY ./RiskControl.Sites/RiskControl.Sites.csproj ./RiskControl.Sites/RiskControl.Sites.csproj

RUN ls /src -l
WORKDIR /src/RiskControl.Sites
RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore -v n

COPY ./RiskControl.Sites .
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish -r linux-x64 --self-contained false -c Release -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:7.0-alpine AS base

ENV TZ="America/La_Paz" 
ENV COMPlus_EnableDiagnostics=0


# Don’t run as root
RUN adduser --disabled-password \
  --home /app \
  --gecos '' dotnetuser && chown -R dotnetuser /app && chown -R dotnetuser /tmp
USER dotnetuser
#

WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "RiskControl.Sites.dll"]
