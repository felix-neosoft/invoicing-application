const PDFDocument = require('pdfkit')
const fs = require('fs')

const generatepdf = (userData,companyData,invoiceData,productData,pdfname) =>{
    const doc = new PDFDocument
    doc.pipe(fs.createWriteStream(`./data/pdf/${pdfname}`))

    generateHeader(doc, companyData, invoiceData);
	generateCustomerInformation(doc, userData, companyData, invoiceData);
	generateInvoiceTable(doc, productData);
    
    doc.end()
}

function generateHeader(doc,companyData,invoiceData) {
	doc.image(`./data/logo/${companyData.company_logo_name}`, 75, 45, { width: 75 })
		.fontSize(30)
		.text('Invoice', 200, 68, { align: 'right' })
        .fontSize(10)
		.text(`No.${invoiceData.pid}`, 200, 93, { align: 'right' })
		.moveDown();
}

function generateCustomerInformation(doc, userData, companyData, invoiceData) {
	doc
        .fontSize(15)
        .text("From", 75, 200)
        .fontSize(20)
		.text(`${userData.first_name} ${userData.last_name}`, 75, 220)
		.text(`${companyData.company_name}`, 75, 240)
		.text(`${userData.email}`, 75, 260)
        .fontSize(15)
        .text("Bill To", 75, 300)
        .fontSize(20)
		.text(`${invoiceData.receiver_name}`, 75, 320)
		.text(`${invoiceData.receiver_address}`, 75, 340)
        .fontSize(15)
		.text('Status', 200, 200, { align: 'right' })
        .fillColor('#ff0000')
        .fontSize(20)
		.text(`${invoiceData.status}`, 200, 220, { align: 'right' })
        .fillColor('#000000')
        .fontSize(15)
		.text('Invoice Date', 200, 250, { align: 'right' })
		.text(`${invoiceData.invoice_date}`, 200, 265, { align: 'right' })
		.text('Due Date', 200, 310, { align: 'right' })
		.text(`${invoiceData.due_date}`, 200, 325, { align: 'right' })
		.moveDown();
}

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
	doc.fontSize(15)
		.text(c1, 75, y)
		.text(c2, 175, y)
		.text(c3, 280, y, { width: 90, align: 'right' })
		.text(c4, 370, y, { width: 90, align: 'right' })
		.text(c5, 0, y, { align: 'right' });
}

function generateInvoiceTable(doc, invoice) {
	let i,
	invoiceTableTop = 405,
    totalposition = 405,
    totalamount = 0;

    generateTableRow(doc,390,'Sr No.','Name','Qty','Price','Total Price')

	for (i = 0; i < invoice.length; i++) {
		const item = invoice[i];
		const position = invoiceTableTop + (i + 1) * 30;
        totalposition+=(i+1) *30
        totalamount+=parseInt(item.totalValue)
		generateTableRow(
			doc,
			position,
			i+1,
			item.item,
			item.quantity,
			item.price,
			item.totalValue,
		);
	}
    doc
        .fontSize(20)
        .text(`Total Amount : ${totalamount}`, 200, totalposition+50, {align:'right'})
}


module.exports = generatepdf
