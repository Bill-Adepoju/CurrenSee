using Newtonsoft.Json;

namespace CurrencyExchangeRate.Dtos
{
    public record ExchangeRateConverterDto
    {
        public decimal SourceUnit { get; set; }

        //public decimal DestinationUnit { get; set; }

        public string SourceCurrency { get; set; }

        public string DestinationCurrency { get; set; }
    }

    public record ExchangeRateResponse
    {
        [JsonProperty("query")]
        public QueryInfo Query { get; set; }

        [JsonProperty("info")]
        public Info Info { get; set; }
        [JsonProperty("result")]

        public double Result { get; set; }
    }

    public class QueryInfo
    {
        [JsonProperty("from")]
        public string From { get; set; }

        [JsonProperty("to")]
        public string To { get; set; }
    }

    public class Info
    {
        [JsonProperty("timestamp")]
        public long Timestamp { get; set; }

        [JsonProperty("rate")]
        public string Rate { get; set; }

        
    }

    public class CurrencyInfo
    {
        public string Name { get; set; }

        [JsonProperty("symbol")]
        public string Code { get; set; }
    }

    public class CurrencySymbolsResponse
    {
        public Dictionary<string, CurrencyInfo> Currencies { get; set; }
    }

    public class HistoricalData
    {
        public string StartDate { get; set; }
        public string EndDate { get; set; }

        public string Source { get; set; }

        public string Destination { get; set; }
    }

    public class HistoryExchangeRateData
    {
        public bool Success { get; set; }
        public bool Timeseries { get; set; }

        [JsonProperty("start_date")]
        public string StartDate { get; set; }

        [JsonProperty("end_date")]
        public string EndDate { get; set; }
        public string Base { get; set; }
        public Dictionary<string, Dictionary<string, double>> Rates { get; set; }
    }
}
