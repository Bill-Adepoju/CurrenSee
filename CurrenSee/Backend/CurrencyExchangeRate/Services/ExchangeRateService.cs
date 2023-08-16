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
                string url_str = $"https://api.exchangerate.host/convert?from={model.SourceCurrency}&to={model.DestinationCurrency}&amount={model.SourceUnit}";
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
                //Console.WriteLine("HTTP request failed with status code: " + response.StatusCode);
            }
        }


        public async Task<SuccessResponse<CurrencySymbolsResponse>> GetCurrencies()
        {
            try
            {
                string url_str = $"https://api.exchangerate.host/symbols";
                HttpResponseMessage response = await _httpClient.GetAsync(url_str);


                if (response.IsSuccessStatusCode)
                {
                    string content = await response.Content.ReadAsStringAsync();
                    var responseContent = JsonConvert.DeserializeObject<CurrencySymbolsResponse>(content);
                    return new SuccessResponse<CurrencySymbolsResponse>
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
                //Console.WriteLine("HTTP request failed with status code: " + response.StatusCodec
            }
        }

        public SuccessResponse<HistoryExchangeRateData> HistoricalData(HistoricalData model)
        {
            try
            {
                //string apiKey = "wvLt0NtQ3GOJsyjKpIPAr0rlF0U2QVfu";
                //string url_str = $"https://api.apilayer.com/exchangerates_data/timeseries?start_date={model.StartDate}&end_date={model.EndDate}";
                //_httpClient.DefaultRequestHeaders.Add("apikey", apiKey);
                //HttpResponseMessage response = await _httpClient.GetAsync(url_str);


                //if (response.IsSuccessStatusCode)
                //{
                //    string content = await response.Content.ReadAsStringAsync();
                //    var responseContent = JsonConvert.DeserializeObject<HistoryExchangeRateData>(content);
                //    return new SuccessResponse<HistoryExchangeRateData>
                //    {
                //        Data = responseContent,
                //        Message = "Historical data successsfully gotten",
                //        Success = true,
                //    };
                //}
                //return null;
                if (model is not null)
                {
                    var client = new RestClient($"https://api.apilayer.com/exchangerates_data/timeseries?start_date={model.StartDate}&end_date={model.EndDate}&base={model.Base}&symbols={model.Symbol}");
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
                        //Console.WriteLine(response.Content);
                }
                throw new RestException(HttpStatusCode.BadRequest, "Start-Date and End-Date has to be entered");

            }
            catch (Exception ex)
            {
                throw new RestException(HttpStatusCode.InternalServerError, ex.Message);
                //Console.WriteLine("HTTP request failed with status code: " + response.StatusCode);
            }
        }
    }
}