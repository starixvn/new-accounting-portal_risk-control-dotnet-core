FROM hub.nexdev.net/base/dotnet/core/sdk:5.0.102-ca-patch-buster-slim AS builder
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
RUN dotnet nuget add source http://nuget.nexdev.net/api/v2
RUN dotnet restore -v n

COPY ./src/RiskControl.Sites .

RUN dotnet publish -r linux-x64 --self-contained false -c Release -o /app 

FROM hub.nexdev.net/base/dotnet/core/aspnet:5.0-buster-slim AS base

RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /etc/ssl/openssl.cnf
RUN sed -i 's/DEFAULT@SECLEVEL=2/DEFAULT@SECLEVEL=1/g' /usr/lib/ssl/openssl.cnf
RUN sed -i 's/MinProtocol = TLSv1.2/MinProtocol = TLSv1/g' /usr/lib/ssl/openssl.cnf

ENV TZ="America/La_Paz" 


WORKDIR /app
COPY --from=builder /app .

ENTRYPOINT ["dotnet", "RiskControl.Sites.dll"]
