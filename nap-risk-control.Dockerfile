FROM hub.nexdev.net/base/dotnet/core/sdk:7.0-alpine AS builder
WORKDIR /src

COPY src/RiskControl.Application/*.csproj ./src/RiskControl.Application/
COPY src/RiskControl.BettingMonitoring/*.csproj ./src/RiskControl.BettingMonitoring/
COPY src/RiskControl.Core/*.csproj ./src/RiskControl.Core/
COPY src/RiskControl.Dashboard/*.csproj ./src/RiskControl.Dashboard/
COPY src/RiskControl.NonSportsGamesStatistics/*.csproj ./src/RiskControl.NonSportsGamesStatistics/
COPY src/RiskControl.ProgressiveJackpot/*.csproj ./src/RiskControl.ProgressiveJackpot/
COPY src/RiskControl.WinLossLimitControl/*.csproj ./src/RiskControl.WinLossLimitControl/
COPY RiskControl.Sites/*.csproj ./RiskControl.Sites/


RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet restore RiskControl.Sites/RiskControl.Sites.csproj

COPY src ./src
COPY RiskControl.Sites ./RiskControl.Sites

WORKDIR /src/RiskControl.Sites

RUN --mount=type=cache,target=/root/.nuget/packages \
    dotnet publish -c Release -o /app --no-restore

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
