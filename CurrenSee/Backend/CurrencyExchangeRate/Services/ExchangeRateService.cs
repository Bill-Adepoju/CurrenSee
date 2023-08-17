using CurrencyExchangeRate.Contracts;
using CurrencyExchangeRate.Dtos;
using CurrencyExchangeRate.Helpers;
using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Newtonsoft.Json;
using RestSharp;
using System.Net;
using System.Net.Http;
using System.Reflection;

namespace CurrencyExchangeRate.Services
{
    public class ExchangeRateService : IExchangeRateService
    {
        private readonly HttpClient _httpClient;

        public ExchangeRateService(HttpClient httpClient)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
        }
        public async Task<SuccessResponse<ExchangeRateResponse>> GetExchangeConversion(Dtos.ExchangeRateConverterDto model)
        {
            try
            {
                string apiKey = "b06827533898571e3cfe2ac4b470071a";
                string url_str = $"https://api.exchangerate.host/convert?access_key={apiKey}&from={model.SourceCurrency}&to={model.DestinationCurrency}&amount={model.SourceUnit}";
                HttpResponseMessage response = await _httpClient.GetAsync(url_str);


                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    var responseContent = JsonConvert.DeserializeObject<ExchangeRateResponse>(content);
                    return new SuccessResponse<ExchangeRateResponse>
                    {
                        Data = responseContent,
                        Message = "Conversion of rates successful",
                        Success = true,
                    };
                }
                return null;

            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.InternalServerError, ex.Message);
            }
        }


        public async Task<SuccessResponse<List<CurrencySymbolsResponse>>> GetCurrencies()
        {
            try
            {
                string url_str = $"https://restcountries.com/v3.1/all?fields=currencies";
                HttpResponseMessage response = await _httpClient.GetAsync(url_str);


                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    var responseContent = JsonConvert.DeserializeObject<List<CurrencySymbolsResponse>>(content);
                    return new SuccessResponse<List<CurrencySymbolsResponse>>
                    {
                        Data = responseContent,
                        Message = "Currencies successsfully gotten",
                        Success = true,
                    };
                }
                return null;

            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.InternalServerError, ex.Message);
            }
        }

        public SuccessResponse<HistoryExchangeRateData> HistoricalData(HistoricalData model)
        {
            try
            {
                if (model.StartDate  is not null && model.EndDate is not null)
                {
                    var client = new RestClient($"https://api.apilayer.com/exchangerates_data/timeseries?start_date={model.StartDate}&end_date={model.EndDate}&base={model.Source}&symbols={model.Destination}");
                    client.Timeout = -1;

                    var request = new RestRequest(Method.GET);
                    request.AddHeader("apikey", "wvLt0NtQ3GOJsyjKpIPAr0rlF0U2QVfu");

                    IRestResponse response = client.Execute(request);
                    var responseContent = JsonConvert.DeserializeObject<HistoryExchangeRateData>(response.Content);
                    return new SuccessResponse<HistoryExchangeRateData>
                    {
                        Data = responseContent,
                        Message = "Historical data successsfully gotten",
                        Success = true,
                    };
                }
                throw new RestException(HttpStatusCode.BadRequest, "Start-Date and End-Date has to be entered");

            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.InternalServerError, ex.Message);
            }
        }
    }
}