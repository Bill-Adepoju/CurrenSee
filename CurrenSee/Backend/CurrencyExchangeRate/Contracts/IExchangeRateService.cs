using CurrencyExchangeRate.Dtos;
using CurrencyExchangeRate.Helpers;

namespace CurrencyExchangeRate.Contracts
{
    public interface IExchangeRateService
    {
        Task<SuccessResponse<ExchangeRateResponse>> GetExchangeConversion(Dtos.ExchangeRateConverterDto model);
        Task<SuccessResponse<CurrencySymbolsResponse>> GetCurrencies();

        SuccessResponse<HistoryExchangeRateData> HistoricalData(HistoricalData model);
    }
}
