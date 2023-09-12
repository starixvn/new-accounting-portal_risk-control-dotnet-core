FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY ./src/RiskControl.Application ./RiskControl.Application
COPY ./src/RiskControl.BettingMonitoring ./RiskControl.BettingMonitoring
COPY ./src/RiskControl.Core ./RiskControl.Core
COPY ./src/RiskControl.Dashboard ./RiskControl.Dashboard
COPY ./src/RiskControl.NonSportsGamesStatistics ./RiskControl.NonSportsGamesStatistics
COPY ./src/RiskControl.ProgressiveJackpot ./RiskControl.ProgressiveJackpot
COPY ./src/RiskControl.VoidRejectRefund ./RiskControl.VoidRejectRefund
COPY ./src/RiskControl.WinLossLimitControl ./RiskControl.WinLossLimitControl
COPY ./src/RiskControl.Sites/RiskControl.Sites.csproj ./RiskControl.Sites/RiskControl.Sites.csproj

RUN ls /src -l
WORKDIR /src/RiskControl.Sites
RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN dotnet restore -v n

COPY ./src/RiskControl.Sites .

RUN dotnet publish -r linux-x64 --self-contained false -c Release -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:7.0-alpine AS base

ENV TZ="America/La_Paz" 


WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "RiskControl.Sites.dll"]
