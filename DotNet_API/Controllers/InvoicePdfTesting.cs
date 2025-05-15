using Microsoft.AspNetCore.Mvc;
using DinkToPdf;
using DinkToPdf.Contracts;
using DotNet_API.DtoModels;
using DotNet_API.Services;

[Route("api/[controller]")]
[ApiController]
public class InvoicePdfTesting : ControllerBase
{
    private readonly IConverter _converter;
    private readonly IViewRenderService _viewRenderer;

    public InvoicePdfTesting(IConverter converter, IViewRenderService viewRenderer)
    {
        _converter = converter;
        _viewRenderer = viewRenderer;
    }
    [HttpPost("generate-invoice-pdf")]
    public async Task<FileResult> GenerateInvoicePdf([FromBody] InvoiceDto invoice)
    {
        var html = await _viewRenderer.RenderToStringAsync("~/TemplateViews/test_template.cshtml", invoice);

        var doc = new HtmlToPdfDocument()
        {
            GlobalSettings = {
            ColorMode = ColorMode.Color,
            PaperSize = PaperKind.A4,
            Margins = new MarginSettings { Top = 10, Bottom = 10, Left = 10, Right = 10 }
        },
            Objects = {
            new ObjectSettings {
                HtmlContent = html,
                WebSettings = {
                    DefaultEncoding = "utf-8",
                    LoadImages = true,
                    EnableIntelligentShrinking = true
                }
            }
        }
        };

        byte[] pdf = _converter.Convert(doc);
        return File(pdf, "application/pdf", $"invoice-{invoice.InvoiceNo}.pdf");
    }



    [HttpPost("preview")]
    public async Task<IActionResult> PreviewInvoice([FromBody] InvoiceDto invoice)
    {
        var html = await _viewRenderer.RenderToStringAsync("~/TemplateViews/test_template.cshtml", invoice);
        return Ok(html);
    }





}