import jsPDF from "jspdf";
import "jspdf-autotable";
import { formatNumber } from './formatters';

export const generatePDF = (data) => {
  const {
    principal,
    interestRate,
    tenure,
    tenureType,
    processingFee,
    emi,
    totalInterest,
    totalAmount,
    emiDetails
  } = data;

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Helper function to add footer
  const addFooter = () => {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const footerY = pageHeight - 25;

    // Footer divider line
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(14, footerY, pageWidth - 14, footerY);

    // Footer content
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text("HisaabKaro", 14, footerY + 8);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Your Digital Expense Management Partner", 14, footerY + 14);

    doc.setTextColor(37, 99, 235);
    doc.text(
      "www.hisaabkaro.com",
      pageWidth / 2,
      footerY + 14,
      { align: "center" }
    );

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    const currentDate = new Date().toLocaleDateString("en-US");
    const year = new Date().getFullYear();
    doc.text(`Generated: ${currentDate}`, 14, footerY + 20);
    doc.text(
      ` ${year} HisaabKaro. All rights reserved`,
      pageWidth - 14,
      footerY + 20,
      { align: "right" }
    );
  };

  // Add title
  doc.setFontSize(16);
  doc.text("EMI Repayment Schedule", 14, 12);

  // Helper function to draw a card
  const drawCard = (title, value, x, color) => {
    const cardWidth = 35;
    const cardHeight = 30;
    doc.setFillColor(...color);
    doc.roundedRect(x, 20, cardWidth, cardHeight, 3, 3, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text(title, x + 2, 28, { maxWidth: cardWidth - 4 });

    doc.setFontSize(11);
    doc.text(value || "-", x + 2, 40, { maxWidth: cardWidth - 4 });
  };

  // Calculate spacing between cards
  const pageWidth = doc.internal.pageSize.width;
  const margin = 14;
  const cardWidth = 35;
  const spacing = (pageWidth - 2 * margin - 7 * cardWidth) / 6;

  // Draw cards with different colors in one row
  drawCard(
    "Principal Amount",
    formatNumber(principal),
    margin,
    [37, 99, 235]
  );
  drawCard(
    "Interest Rate",
    `${interestRate}%`,
    margin + cardWidth + spacing,
    [139, 92, 246]
  );
  drawCard(
    "Loan Term",
    `${tenure} ${tenureType}`,
    margin + (cardWidth + spacing) * 2,
    [34, 197, 94]
  );
  drawCard(
    "Processing Fee",
    formatNumber(processingFee),
    margin + (cardWidth + spacing) * 3,
    [234, 179, 8]
  );
  drawCard(
    "Monthly EMI",
    formatNumber(emi),
    margin + (cardWidth + spacing) * 4,
    [239, 68, 68]
  );
  drawCard(
    "Total Interest",
    formatNumber(totalInterest),
    margin + (cardWidth + spacing) * 5,
    [99, 102, 241]
  );
  drawCard(
    "Total Amount",
    formatNumber(totalAmount),
    margin + (cardWidth + spacing) * 6,
    [236, 72, 153]
  );

  // Add repayment schedule table with optimized spacing
  doc.autoTable({
    startY: 60,
    head: [["Month", "EMI", "Principal Paid", "Interest Paid", "Balance"]],
    body: emiDetails.map((detail) => [
      detail.month,
      formatNumber(detail.emi),
      formatNumber(detail.principalPaid),
      formatNumber(detail.interestPaid),
      formatNumber(detail.remainingPrincipal),
    ]),
    theme: "grid",
    headStyles: { 
      fillColor: [37, 99, 235],
      fontSize: 10,
      halign: 'center',
      cellPadding: 2,
      minCellHeight: 8
    },
    styles: { 
      fontSize: 9,
      cellPadding: 2,
      halign: 'right',
      minCellHeight: 6,
      lineColor: [200, 200, 200],
      lineWidth: 0.1
    },
    columnStyles: {
      0: { cellWidth: 25, halign: 'center' },
      1: { cellWidth: 55 },
      2: { cellWidth: 55 },
      3: { cellWidth: 55 },
      4: { cellWidth: 55 }
    },
    margin: { 
      top: 15,
      left: 15,
      right: 15,
      bottom: 30
    },
    tableWidth: 'auto',
    showHead: 'firstPage',
    didDrawPage: function (data) {
      // Only add top margin on first page
      if (data.pageNumber === 1) {
        data.cursor.y = 60;
      } else {
        data.cursor.y = 15;  // Reduced top margin for subsequent pages
      }
      
      addFooter();
    },
  });

  // Add footer to the first page if table fits on one page
  if (doc.lastAutoTable.finalY < doc.internal.pageSize.height - 60) {
    addFooter();
  }

  // Save PDF
  doc.save("EMI_Repayment_Schedule.pdf");
};
