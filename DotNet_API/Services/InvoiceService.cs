using AutoMapper;
using DinkToPdf;
using DinkToPdf.Contracts;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.DtoModels;
using DotNet_API.Repositories;
using DotNet_API.Utilities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DotNet_API.Services
{
    public class InvoiceService
    {

        private readonly InvoiceRepository invoiceRepository;
        private readonly ViewRenderService viewRenderService;
        private readonly IConverter converter;
        private readonly AppDbContext appDbContext;
        public InvoiceService(InvoiceRepository invoiceRepository, ViewRenderService viewRenderService, IConverter converter, AppDbContext appDbContext)
        {

            this.invoiceRepository = invoiceRepository;
            this.viewRenderService = viewRenderService;
            this.converter = converter;
            this.appDbContext = appDbContext;
        }



        public async Task<FileResult> GenerateInvoicePdf(int invoiceId)
        {
            InvoiceDto invoice = await this.invoiceRepository.GetById(invoiceId);


            if (invoice == null)
            {
                throw new KeyNotFoundException($"Invoice with ID {invoiceId} not found");
            }

            try
            {
               
                var html = await this.viewRenderService.RenderToStringAsync($"{invoice.InvoiceTemplate!.TemplatePath}", invoice);

                var doc = new HtmlToPdfDocument()
                {
                    GlobalSettings = {
                    ColorMode = ColorMode.Color,
                    PaperSize = PaperKind.A4,
                    Margins = new MarginSettings {
                    Top = 10,
                    Bottom = 10,
                    Left = 10,
                    Right = 10
                }},
                    Objects = { new ObjectSettings { HtmlContent = html, WebSettings = { DefaultEncoding = "utf-8", LoadImages = true, EnableIntelligentShrinking = true } } }
                };

                byte[] pdf = this.converter.Convert(doc);
                return new FileContentResult(pdf, "application/pdf")
                {
                    FileDownloadName = $"invoice-{invoice.InvoiceNo}.pdf"
                };
            }
            catch (Exception ex)
            {

                throw new ApplicationException($"Error generating PDF for invoice {invoiceId}: {ex.Message}", ex);
            }
        }












    }
}
