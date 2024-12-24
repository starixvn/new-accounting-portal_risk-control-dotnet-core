ARG CI_REGISTRY_IMAGE
FROM $CI_REGISTRY_IMAGE:builder as deps
RUN mkdir -p /src/packages

FROM hub.nexdev.net/base/dotnet/core/sdk:9.0-alpine AS builder

ENV NUGET_PACKAGES=/src/packages
COPY --from=deps $NUGET_PACKAGES/. $NUGET_PACKAGES/

WORKDIR /src

COPY src/RiskControl.Application/*.csproj ./src/RiskControl.Application/
COPY src/RiskControl.BettingMonitoring/*.csproj ./src/RiskControl.BettingMonitoring/
COPY src/RiskControl/*.csproj ./src/RiskControl/
COPY src/RiskControl.Dashboard/*.csproj ./src/RiskControl.Dashboard/
COPY src/RiskControl.NonSportsGamesStatistics/*.csproj ./src/RiskControl.NonSportsGamesStatistics/
COPY src/RiskControl.ProgressiveJackpot/*.csproj ./src/RiskControl.ProgressiveJackpot/
COPY src/RiskControl.WinLossLimitControl/*.csproj ./src/RiskControl.WinLossLimitControl/
COPY RiskControl.Sites/*.csproj ./RiskControl.Sites/


RUN dotnet nuget add source https://nuget.nexdev.net/api/v2
RUN dotnet restore -v n -r linux-x64 RiskControl.Sites/RiskControl.Sites.csproj

COPY src ./src
COPY RiskControl.Sites ./RiskControl.Sites

WORKDIR /src/RiskControl.Sites

RUN dotnet publish -r linux-x64 --self-contained false -o /app

FROM hub.nexdev.net/base/dotnet/core/aspnet:9.0-alpine AS base

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
