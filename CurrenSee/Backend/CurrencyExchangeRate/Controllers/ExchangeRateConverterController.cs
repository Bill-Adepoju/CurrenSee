using CurrencyExchangeRate.Contracts;
using CurrencyExchangeRate.Dtos;
using CurrencyExchangeRate.Helpers;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Data;

namespace CurrencyExchangeRate.Controllers
{
    [ApiController]
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/exchange")]
    public class ExchangeRateConverterController : ControllerBase
    {
        public readonly IExchangeRateService  _exchangeRateService;
        public ExchangeRateConverterController(IExchangeRateService exchangeRateService)
        {
            _exchangeRateService = exchangeRateService;
        }

        [AllowAnonymous]
        [HttpGet()]
        [ProducesResponseType(typeof(SuccessResponse<ExchangeRateResponse>), 200)]
        public async Task<IActionResult> GetExchangeConversionValue([FromQuery] ExchangeRateConverterDto model)
        {
            var response = await _exchangeRateService.GetExchangeConversion(model);

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("currencies")]
        [ProducesResponseType(typeof(SuccessResponse<List<CurrencySymbolsResponse>>), 200)]
        public async Task<IActionResult> GetCurrencies()
        {
            var response = await _exchangeRateService.GetCurrencies();

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpGet("history")]
        [ProducesResponseType(typeof(SuccessResponse<HistoryExchangeRateData>), 200)]
        public IActionResult GetHistoricalData([FromQuery] HistoricalData model)
        {
            var response = _exchangeRateService.HistoricalData(model);

            return Ok(response);
        }
    }

}
