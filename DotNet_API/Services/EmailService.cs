using AutoMapper;
using DinkToPdf.Contracts;
using DotNet_API.DatabaseContext;
using DotNet_API.DataModels;
using DotNet_API.DtoModels;
using DotNet_API.Repositories;
using DotNet_API.Utilities;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace DotNet_API.Services
{
    public class EmailService
    {
        private readonly IConfiguration _configuration;
        private readonly InvoiceRepository _invoiceRepository;
        public EmailService(IConfiguration configuration, InvoiceRepository invoiceRepository)
        {
            _configuration = configuration;
            _invoiceRepository = invoiceRepository;
        }

        //public async Task<ResponseObject<bool>> SendInvoiceEmailAsync(int invoiceId)
        //{
            

        //    var invoice = await _invoiceRepository.GetInvoiceById(invoiceId);
        //    if (invoice == null)
        //    {
        //        return new ResponseObject<bool>(false, "Invoice not found", false);
        //    }

        //    string htmlBody = GetInvoiceEmailTemplate(invoice);
        //    string subject = $"Invoice {invoice.InvoiceNo} from {invoice.CompanyName}";

        //   var sendInvoice = await SendInvoice(invoice.Id, invoice.CompanyName, invoice.CompanyEmail, invoice.Client!.Email, subject, htmlBody);

        //    if (!sendInvoice)
        //    {
        //        return new ResponseObject<bool>(false, "There was an error sending the invoice", false);
        //    }

        //    return new ResponseObject<bool>(true, "Email sent sucessfully", true);

        //}



        public async Task<bool> SendInvoice(int invoiceId, string senderName, string senderEmail, string sendTo, string subject, string htmlBody)
        {
            var emailSettings = _configuration.GetSection("EmailSettings");
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress(senderName, senderEmail));
            message.To.Add(new MailboxAddress("", sendTo));
            message.Subject = subject;
            var bodyBuilder = new BodyBuilder { HtmlBody = htmlBody };
            message.Body = bodyBuilder.ToMessageBody();

            using (var client = new SmtpClient())
            {
                try
                {
                    client.Timeout = 60000;
                    await client.ConnectAsync(emailSettings["SmtpServer"], int.Parse(emailSettings["Port"]), SecureSocketOptions.Auto);
                    await client.AuthenticateAsync(emailSettings["Username"], emailSettings["Password"]);
                    await client.SendAsync(message);
                    await client.DisconnectAsync(true);
                    Console.WriteLine($"Invoice email sent successfully!");
                    return true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Email sending failed: {ex.Message}");
                    return false;
                }
            }
        }




        private string GetInvoiceEmailTemplate(Invoice invoice)
        {
            return $@"
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Invoice {invoice.InvoiceNo} - Your Company</title>
        <style>
            body {{
                font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, sans-serif;
                background-color: #f8fafc;
                margin: 0;
                padding: 0;
                color: #1e293b;
                line-height: 1.5;
            }}

            .container {{
                max-width: 600px;
                margin: 40px auto;
                background: #ffffff;
                border-radius: 16px;
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                padding: 32px;
            }}

            .header {{
                text-align: left;
                margin-bottom: 32px;
                padding-bottom: 24px;
                border-bottom: 1px solid #e2e8f0;
            }}

            h2 {{
                color: #2563eb;
                font-size: 24px;
                font-weight: 600;
                margin: 0;
            }}

            .subheading {{
                color: #64748b;
                font-size: 14px;
                margin-top: 8px;
            }}

            .invoice-info {{
                background: #f8fafc;
                border-radius: 12px;
                padding: 20px;
                margin: 24px 0;
            }}

            .invoice-summary {{
                width: 100%;
                border-spacing: 0;
                margin: 24px 0;
            }}

            .invoice-summary th {{
                background-color: #f1f5f9;
                color: #475569;
                font-weight: 500;
                text-align: left;
                padding: 12px 16px;
                font-size: 14px;
            }}

            .invoice-summary td {{
                padding: 16px;
                border-bottom: 1px solid #e2e8f0;
            }}

            .amount {{
                font-size: 20px;
                font-weight: 600;
                color: #2563eb;
            }}

            .status {{
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 500;
                background-color: #dbeafe;
                color: #2563eb;
            }}

            .button {{
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 500;
                margin: 24px 0;
                text-align: center;
            }}

            .button:hover {{
                background-color: #1d4ed8;
            }}

            .next-steps {{
                background: #f8fafc;
                border-radius: 12px;
                padding: 20px;
                margin: 24px 0;
            }}

            .next-steps h3 {{
                color: #1e293b;
                font-size: 16px;
                margin: 0 0 12px 0;
            }}

            .footer {{
                margin-top: 32px;
                padding-top: 24px;
                border-top: 1px solid #e2e8f0;
                text-align: center;
                color: #64748b;
                font-size: 14px;
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h2>Invoice #{invoice.InvoiceNo} from {invoice.CompanyName} </h2>
            </div>

            <p>Dear {invoice.Client!.Name},</p>
            
            <p>Please find attached your invoice for our recent services. Here are the important details:</p>

            <div class='invoice-info'>
                <table class='invoice-summary'>
                    <tr>
                        <th>Invoice Number</th>
                        <td>#{invoice.InvoiceNo}</td>
                    </tr>
                    <tr>
                        <th>Issue Date</th>
                        <td>{invoice.IssueDate.ToString("MMMM dd, yyyy")}</td>
                    </tr>
                    <tr>
                        <th>Payment Due</th>
                        <td>{invoice.DueDate.ToString("MMMM dd, yyyy")}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td class='amount'>{invoice.Total:C}</td>
                    </tr>
                    <tr>
                        <th>Payment Status</th>
                        <td><span class='status'>{invoice.Status}</span></td>
                    </tr>
                </table>
            </div>

            <div class='next-steps'>
                <h3>Payment Instructions</h3>
                <p>1. Review the complete invoice details using the link below</p>
                <p>2. Process payment before the due date: {invoice.DueDate.ToString("MMMM dd, yyyy")}</p>
                <p>3. Retain a copy for your financial records</p>
            </div>

            <div style='text-align: center;'>
                <a href='https://example.com/' class='button'>
                    View Invoice Details
                </a>
            </div>

            <div class='footer'>
                <p>For any inquiries regarding this invoice, please contact our finance department:</p>
                <p>
                    <strong>Your Company</strong><br>
                    123 Business Street, Suite 100<br>
                    City, State 12345<br>
                    Email: finance@yourcompany.com<br>
                    Phone: (555) 123-4567
                </p>
            </div>
        </div>
    </body>
    </html>";
        }







    }
}
