package com.smartfarm.backendms1.service.impl;

// Corrected imports for iText 5
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.smartfarm.backendms1.bean.*;
import com.smartfarm.backendms1.service.facade.PdfReportService;
import com.smartfarm.backendms1.service.facade.ProfitabilityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class PdfReportServiceImpl implements PdfReportService {

    @Autowired
    private ProfitabilityService profitabilityService;

    // Corrected fonts for iText 5
    private static final Font TITLE_FONT = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.DARK_GRAY);
    private static final Font SUBTITLE_FONT = new Font(Font.FontFamily.HELVETICA, 14, Font.BOLD, BaseColor.BLACK);
    private static final Font NORMAL_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
    private static final Font BOLD_FONT = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.BLACK);

    private final DecimalFormat currencyFormat = new DecimalFormat("#,##0.00");
    private final DecimalFormat percentFormat = new DecimalFormat("#0.00");
    private final DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");

    @Override
    public byte[] generateDailyProfitabilityReport(LocalDate date) throws DocumentException, IOException {
        // Correction: using iText 5 syntax
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);

        document.open();

        // Document header
        addHeader(document, "Daily Profitability Report", date.format(dateFormatter));

        // Generate or retrieve daily report
        ProfitabilityReport report = profitabilityService.generateDailyReport(date);

        if (report == null) {
            addParagraph(document, "No data available for this date.", NORMAL_FONT);
            document.close();
            return baos.toByteArray();
        }

        // Financial summary section
        addFinancialSummary(document, report);

        // Cost breakdown section
        addCostBreakdown(document, report);

        // Analysis section
        addAnalysis(document, report, date);

        // Recommendations section
        addRecommendations(document, report);

        // Footer
        addFooter(document);

        document.close();
        return baos.toByteArray();
    }

    @Override
    public byte[] generatePeriodProfitabilityReport(LocalDate startDate, LocalDate endDate) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);

        document.open();

        // Document header
        String period = startDate.format(dateFormatter) + " - " + endDate.format(dateFormatter);
        addHeader(document, "Period Profitability Report", period);

        // Retrieve period reports
        List<ProfitabilityReport> reports = profitabilityService.getReportsByDateRange(startDate, endDate);

        if (reports.isEmpty()) {
            addParagraph(document, "No data available for this period.", NORMAL_FONT);
            document.close();
            return baos.toByteArray();
        }

        // Calculate totals
        ProfitabilityReport aggregatedReport = aggregateReports(reports, startDate);

        // Period summary section
        addPeriodSummary(document, aggregatedReport, reports.size());

        // Daily evolution section
        addDailyEvolution(document, reports);

        // Resource analysis section
        addResourceAnalysis(document, startDate, endDate);

        // Crop profitability section
        addCropProfitabilityAnalysis(document, startDate, endDate);

        // KPIs section
        addKPISection(document, startDate, endDate);

        document.close();
        return baos.toByteArray();

    }

    private void addHeader(Document document, String title, String subtitle) throws DocumentException {
        // Logo and main title
        Paragraph titlePara = new Paragraph(title, TITLE_FONT);
        titlePara.setAlignment(Element.ALIGN_CENTER);
        titlePara.setSpacingAfter(10);
        document.add(titlePara);

        Paragraph subtitlePara = new Paragraph(subtitle, SUBTITLE_FONT);
        subtitlePara.setAlignment(Element.ALIGN_CENTER);
        subtitlePara.setSpacingAfter(20);
        document.add(subtitlePara);

        // Separator line
        LineSeparator line = new LineSeparator();
        document.add(new Chunk(line));
        document.add(Chunk.NEWLINE);
    }

    private void addFinancialSummary(Document document, ProfitabilityReport report) throws DocumentException {
        addSectionTitle(document, "Financial Summary");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        // Cell styles
        PdfPCell headerCell = new PdfPCell();
        headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell.setBorder(Rectangle.BOX);
        headerCell.setPadding(8);

        PdfPCell dataCell = new PdfPCell();
        dataCell.setBorder(Rectangle.BOX);
        dataCell.setPadding(8);

        // Revenue
        headerCell.setPhrase(new Phrase("Total Revenue", BOLD_FONT));
        table.addCell(headerCell);
        dataCell.setPhrase(new Phrase("$" + currencyFormat.format(report.getEstimatedRevenue()), NORMAL_FONT));
        table.addCell(dataCell);

        // Total costs
        headerCell.setPhrase(new Phrase("Total Costs", BOLD_FONT));
        table.addCell(headerCell);
        dataCell.setPhrase(new Phrase("$" + currencyFormat.format(report.getTotalCost()), NORMAL_FONT));
        table.addCell(dataCell);

        // Profit/Loss
        headerCell.setPhrase(new Phrase("Profit/Loss", BOLD_FONT));
        table.addCell(headerCell);
        String profitText = "$" + currencyFormat.format(report.getProfit());
        Font profitFont = report.getProfit() >= 0 ?
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.GREEN) :
                new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.RED);
        dataCell.setPhrase(new Phrase(profitText, profitFont));
        table.addCell(dataCell);

        // Profit margin
        headerCell.setPhrase(new Phrase("Profit Margin", BOLD_FONT));
        table.addCell(headerCell);
        dataCell.setPhrase(new Phrase(percentFormat.format(report.getProfitMargin()) + " %", NORMAL_FONT));
        table.addCell(dataCell);

        // Production
        if (report.getYieldAmount() != null) {
            headerCell.setPhrase(new Phrase("Production", BOLD_FONT));
            table.addCell(headerCell);
            dataCell.setPhrase(new Phrase(currencyFormat.format(report.getYieldAmount()) + " kg", NORMAL_FONT));
            table.addCell(dataCell);
        }

        document.add(table);
    }

    private void addCostBreakdown(Document document, ProfitabilityReport report) throws DocumentException {
        addSectionTitle(document, "Cost Breakdown");

        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);
        float[] columnWidths = {4f, 2f, 2f};
        table.setWidths(columnWidths);

        // Headers
        addTableHeader(table, "Cost Category");
        addTableHeader(table, "Amount ($)");
        addTableHeader(table, "% of Total");

        double totalCost = report.getTotalCost();

        // Cost details
        addCostRow(table, "Water Cost", report.getWaterCost(), totalCost);
        addCostRow(table, "Electricity Cost", report.getEnergyCost(), totalCost);
        addCostRow(table, "Labor Cost", report.getLaborCost() != null ? report.getLaborCost() : 0, totalCost);
        addCostRow(table, "Purchases/Materials", report.getFertilizerCost() != null ? report.getFertilizerCost() : 0, totalCost);
        addCostRow(table, "Sensor Maintenance", report.getSensorMaintenanceCost() != null ? report.getSensorMaintenanceCost() : 0, totalCost);
        addCostRow(table, "Other Costs", report.getOtherCosts() != null ? report.getOtherCosts() : 0, totalCost);

        document.add(table);
    }

    private void addAnalysis(Document document, ProfitabilityReport report, LocalDate date) throws DocumentException {
        addSectionTitle(document, "Analysis and Observations");

        StringBuilder analysis = new StringBuilder();

        // Profitability analysis
        if (report.getProfit() > 0) {
            analysis.append("✓ Profitable day with a profit of $")
                    .append(currencyFormat.format(report.getProfit()))
                    .append(".\n\n");
        } else {
            analysis.append("⚠ Loss-making day with a loss of $")
                    .append(currencyFormat.format(Math.abs(report.getProfit())))
                    .append(".\n\n");
        }

        // Margin analysis
        analysis.append("Profit margin: ");
        if (report.getProfitMargin() > 20) {
            analysis.append("Excellent (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else if (report.getProfitMargin() > 10) {
            analysis.append("Good (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else if (report.getProfitMargin() > 0) {
            analysis.append("Low (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else {
            analysis.append("Negative (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        }
        analysis.append("\n\n");

        // Main cost analysis
        double maxCost = Math.max(report.getWaterCost(),
                Math.max(report.getEnergyCost(),
                        report.getLaborCost() != null ? report.getLaborCost() : 0));

        if (maxCost == report.getWaterCost()) {
            analysis.append("Water cost represents the largest expense of the day.");
        } else if (maxCost == report.getEnergyCost()) {
            analysis.append("Electricity cost represents the largest expense of the day.");
        } else {
            analysis.append("Labor costs represent the largest expense of the day.");
        }

        addParagraph(document, analysis.toString(), NORMAL_FONT);
    }

    private void addRecommendations(Document document, ProfitabilityReport report) throws DocumentException {
        addSectionTitle(document, "Recommendations");

        StringBuilder recommendationText = new StringBuilder();

        if (report.getProfit() < 0) {
            recommendationText.append("• Analyze the causes of the loss and identify cost items to optimize\n");
            recommendationText.append("• Check the efficiency of irrigation and lighting systems\n");
        }

        if (report.getWaterCost() > report.getTotalCost() * 0.3) {
            recommendationText.append("• Optimize water consumption - high cost detected\n");
        }

        if (report.getEnergyCost() > report.getTotalCost() * 0.3) {
            recommendationText.append("• Check electrical systems - high energy consumption detected\n");
        }

        if (report.getProfitMargin() < 10) {
            recommendationText.append("• Improve profit margin by optimizing costs or increasing selling prices\n");
        }

        recommendationText.append("• Continue daily monitoring to identify trends");

        addParagraph(document, recommendationText.toString(), NORMAL_FONT);
    }

    private void addPeriodSummary(Document document, ProfitabilityReport aggregatedReport, int numberOfDays) throws DocumentException {
        addSectionTitle(document, "Period Summary (" + numberOfDays + " days)");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        addSummaryRow(table, "Total Revenue", "$" + currencyFormat.format(aggregatedReport.getEstimatedRevenue()));
        addSummaryRow(table, "Total Costs", "$" + currencyFormat.format(aggregatedReport.getTotalCost()));
        addSummaryRow(table, "Total Profit/Loss", "$" + currencyFormat.format(aggregatedReport.getProfit()));
        addSummaryRow(table, "Average Margin", percentFormat.format(aggregatedReport.getProfitMargin()) + " %");
        addSummaryRow(table, "Average Profit/Day", "$" + currencyFormat.format(aggregatedReport.getProfit() / numberOfDays));

        document.add(table);
    }

    private void addDailyEvolution(Document document, List<ProfitabilityReport> reports) throws DocumentException {
        addSectionTitle(document, "Daily Evolution");

        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);
        float[] columnWidths = {2f, 2f, 2f, 2f};
        table.setWidths(columnWidths);

        addTableHeader(table, "Date");
        addTableHeader(table, "Revenue ($)");
        addTableHeader(table, "Costs ($)");
        addTableHeader(table, "Profit ($)");

        for (ProfitabilityReport report : reports) {
            addTableCell(table, report.getDate().format(dateFormatter));
            addTableCell(table, currencyFormat.format(report.getEstimatedRevenue()));
            addTableCell(table, currencyFormat.format(report.getTotalCost()));
            addTableCell(table, currencyFormat.format(report.getProfit()));
        }

        document.add(table);
    }

    private void addResourceAnalysis(Document document, LocalDate startDate, LocalDate endDate) throws DocumentException {
        addSectionTitle(document, "Resource Analysis");

        List<ResourceUsage> resourceUsages = profitabilityService.getResourceUsageData(startDate, endDate);

        if (!resourceUsages.isEmpty()) {
            PdfPTable table = new PdfPTable(2);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(15);

            addTableHeader(table, "Resource");
            addTableHeader(table, "Total Cost ($)");

            for (ResourceUsage usage : resourceUsages) {
                addTableCell(table, usage.getName());
                addTableCell(table, currencyFormat.format(usage.getValue()));
            }

            document.add(table);
        }
    }

    private void addCropProfitabilityAnalysis(Document document, LocalDate startDate, LocalDate endDate) throws DocumentException {
        addSectionTitle(document, "Crop Profitability Analysis");

        List<CropProfitability> cropProfitabilities = profitabilityService.getCropProfitabilityData(startDate, endDate);

        if (!cropProfitabilities.isEmpty()) {
            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);
            table.setSpacingBefore(10);
            table.setSpacingAfter(15);
            float[] columnWidths = {3f, 2f, 2f, 2f};
            table.setWidths(columnWidths);

            addTableHeader(table, "Crop");
            addTableHeader(table, "Revenue ($)");
            addTableHeader(table, "Costs ($)");
            addTableHeader(table, "Profit ($)");

            for (CropProfitability crop : cropProfitabilities) {
                addTableCell(table, crop.getName());
                addTableCell(table, currencyFormat.format(crop.getRevenue()));
                addTableCell(table, currencyFormat.format(crop.getCost()));
                addTableCell(table, currencyFormat.format(crop.getProfit()));
            }

            document.add(table);
        }
    }

    private void addKPISection(Document document, LocalDate startDate, LocalDate endDate) throws DocumentException {
        addSectionTitle(document, "Key Performance Indicators");

        Map<String, Object> kpis = profitabilityService.getDashboardKPIs(startDate, endDate);

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        addSummaryRow(table, "Total Water Consumption",
                currencyFormat.format((Double) kpis.get("waterUsage")) + " L");
        addSummaryRow(table, "Total Energy Consumption",
                currencyFormat.format((Double) kpis.get("energyUsage")) + " kWh");
        addSummaryRow(table, "Revenue Change",
                percentFormat.format((Double) kpis.get("revenueChange")) + " %");
        addSummaryRow(table, "Cost Change",
                percentFormat.format((Double) kpis.get("costChange")) + " %");

        document.add(table);
    }

    // Utility methods
    private void addSectionTitle(Document document, String title) throws DocumentException {
        Paragraph sectionTitle = new Paragraph(title, SUBTITLE_FONT);
        sectionTitle.setSpacingBefore(15);
        sectionTitle.setSpacingAfter(5);
        document.add(sectionTitle);
    }

    private void addParagraph(Document document, String text, Font font) throws DocumentException {
        Paragraph paragraph = new Paragraph(text, font);
        paragraph.setSpacingAfter(10);
        document.add(paragraph);
    }

    private void addTableHeader(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(8);
        cell.setPhrase(new Phrase(text, BOLD_FONT));
        table.addCell(cell);
    }

    private void addTableCell(PdfPTable table, String text) {
        PdfPCell cell = new PdfPCell();
        cell.setBorder(Rectangle.BOX);
        cell.setPadding(8);
        cell.setPhrase(new Phrase(text, NORMAL_FONT));
        table.addCell(cell);
    }

    private void addCostRow(PdfPTable table, String category, double amount, double totalCost) {
        addTableCell(table, category);
        addTableCell(table, currencyFormat.format(amount));
        addTableCell(table, percentFormat.format((amount / totalCost) * 100) + "%");
    }

    private void addSummaryRow(PdfPTable table, String label, String value) {
        PdfPCell labelCell = new PdfPCell();
        labelCell.setBorder(Rectangle.BOX);
        labelCell.setPadding(8);
        labelCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        labelCell.setPhrase(new Phrase(label, BOLD_FONT));
        table.addCell(labelCell);

        PdfPCell valueCell = new PdfPCell();
        valueCell.setBorder(Rectangle.BOX);
        valueCell.setPadding(8);
        valueCell.setPhrase(new Phrase(value, NORMAL_FONT));
        table.addCell(valueCell);
    }

    private void addFooter(Document document) throws DocumentException {
        document.add(Chunk.NEWLINE);
        LineSeparator line = new LineSeparator();
        document.add(new Chunk(line));

        Paragraph footer = new Paragraph("Report generated automatically by SmartFarm - " +
                LocalDate.now().format(dateFormatter),
                new Font(Font.FontFamily.HELVETICA, 8, Font.ITALIC, BaseColor.GRAY));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(10);
        document.add(footer);
    }

    private ProfitabilityReport aggregateReports(List<ProfitabilityReport> reports, LocalDate startDate) {
        ProfitabilityReport aggregated = new ProfitabilityReport();
        aggregated.setDate(startDate);

        double totalWaterCost = reports.stream().mapToDouble(ProfitabilityReport::getWaterCost).sum();
        double totalEnergyCost = reports.stream().mapToDouble(ProfitabilityReport::getEnergyCost).sum();
        double totalMaintenanceCost = reports.stream().mapToDouble(r -> r.getSensorMaintenanceCost() != null ? r.getSensorMaintenanceCost() : 0).sum();
        double totalLaborCost = reports.stream().mapToDouble(r -> r.getLaborCost() != null ? r.getLaborCost() : 0).sum();
        double totalPurchaseCost = reports.stream().mapToDouble(r -> r.getFertilizerCost() != null ? r.getFertilizerCost() : 0).sum();
        double totalOtherCosts = reports.stream().mapToDouble(r -> r.getOtherCosts() != null ? r.getOtherCosts() : 0).sum();
        double totalRevenue = reports.stream().mapToDouble(ProfitabilityReport::getEstimatedRevenue).sum();

        double totalCost = totalWaterCost + totalEnergyCost + totalMaintenanceCost + totalLaborCost + totalPurchaseCost + totalOtherCosts;
        double totalProfit = totalRevenue - totalCost;
        double avgProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;

        aggregated.setWaterCost(totalWaterCost);
        aggregated.setEnergyCost(totalEnergyCost);
        aggregated.setSensorMaintenanceCost(totalMaintenanceCost);
        aggregated.setLaborCost(totalLaborCost);
        aggregated.setFertilizerCost(totalPurchaseCost);
        aggregated.setOtherCosts(totalOtherCosts);
        aggregated.setTotalCost(totalCost);
        aggregated.setEstimatedRevenue(totalRevenue);
        aggregated.setProfit(totalProfit);
        aggregated.setProfitMargin(avgProfitMargin);

        return aggregated;
    }

    // Monthly report method
    @Override
    public byte[] generateMonthlyProfitabilityReport(int year, int month) throws DocumentException, IOException {
        Document document = new Document(PageSize.A4);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);

        document.open();

        // Document header
        YearMonth yearMonth = YearMonth.of(year, month);
        String monthName = yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
        addHeader(document, "Monthly Profitability Report", monthName + " " + year);

        // Generate monthly report
        ProfitabilityReport monthlyReport = profitabilityService.generateMonthlyReport(yearMonth);

        if (monthlyReport == null) {
            addParagraph(document, "No data available for this month.", NORMAL_FONT);
            document.close();
            return baos.toByteArray();
        }

        // Monthly financial summary section
        addMonthlyFinancialSummary(document, monthlyReport, yearMonth);

        // Cost breakdown section
        addCostBreakdown(document, monthlyReport);

        // Daily evolution for the month
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<ProfitabilityReport> dailyReports = profitabilityService.getReportsByDateRange(startDate, endDate);
        if (!dailyReports.isEmpty()) {
            addDailyEvolution(document, dailyReports);
        }

        // Resource analysis section
        addResourceAnalysis(document, startDate, endDate);

        // Crop profitability section
        addCropProfitabilityAnalysis(document, startDate, endDate);

        // Monthly analysis section
        addMonthlyAnalysis(document, monthlyReport, yearMonth);

        // Recommendations section
        addMonthlyRecommendations(document, monthlyReport);

        // Footer
        addFooter(document);

        document.close();
        return baos.toByteArray();
    }

    // Private methods to add to PdfReportServiceImpl
    private void addMonthlyFinancialSummary(Document document, ProfitabilityReport report, YearMonth yearMonth) throws DocumentException {
        addSectionTitle(document, "Monthly Financial Summary");

        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(15);

        addSummaryRow(table, "Period", yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH) + " " + yearMonth.getYear());
        addSummaryRow(table, "Total Revenue", "$" + currencyFormat.format(report.getEstimatedRevenue()));
        addSummaryRow(table, "Total Costs", "$" + currencyFormat.format(report.getTotalCost()));

        String profitText = "$" + currencyFormat.format(report.getProfit());
        addSummaryRow(table, "Profit/Loss", profitText);
        addSummaryRow(table, "Profit Margin", percentFormat.format(report.getProfitMargin()) + " %");

        // Daily averages
        int daysInMonth = yearMonth.lengthOfMonth();
        addSummaryRow(table, "Average Revenue/Day", "$" + currencyFormat.format(report.getEstimatedRevenue() / daysInMonth));
        addSummaryRow(table, "Average Cost/Day", "$" + currencyFormat.format(report.getTotalCost() / daysInMonth));
        addSummaryRow(table, "Average Profit/Day", "$" + currencyFormat.format(report.getProfit() / daysInMonth));

        document.add(table);
    }

    private void addMonthlyAnalysis(Document document, ProfitabilityReport report, YearMonth yearMonth) throws DocumentException {
        addSectionTitle(document, "Monthly Analysis");

        StringBuilder analysis = new StringBuilder();

        String monthName = yearMonth.getMonth().getDisplayName(TextStyle.FULL, Locale.ENGLISH);

        // Monthly profitability analysis
        if (report.getProfit() > 0) {
            analysis.append("✓ Profitable month: ").append(monthName)
                    .append(" generated a total profit of $")
                    .append(currencyFormat.format(report.getProfit()))
                    .append(".\n\n");
        } else {
            analysis.append("⚠ Loss-making month: ").append(monthName)
                    .append(" shows a loss of $")
                    .append(currencyFormat.format(Math.abs(report.getProfit())))
                    .append(".\n\n");
        }

        // Average daily performance
        int daysInMonth = yearMonth.lengthOfMonth();
        double dailyAvgProfit = report.getProfit() / daysInMonth;
        analysis.append("Average daily performance: $")
                .append(currencyFormat.format(dailyAvgProfit))
                .append(" per day.\n\n");

        // Monthly margin analysis
        analysis.append("Monthly profit margin: ");
        if (report.getProfitMargin() > 25) {
            analysis.append("Excellent performance (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else if (report.getProfitMargin() > 15) {
            analysis.append("Good performance (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else if (report.getProfitMargin() > 5) {
            analysis.append("Adequate performance (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else if (report.getProfitMargin() > 0) {
            analysis.append("Poor performance (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        } else {
            analysis.append("Negative performance (").append(percentFormat.format(report.getProfitMargin())).append("%)");
        }

        addParagraph(document, analysis.toString(), NORMAL_FONT);
    }

    private void addMonthlyRecommendations(Document document, ProfitabilityReport report) throws DocumentException {
        addSectionTitle(document, "Monthly Recommendations");

        StringBuilder recommendations = new StringBuilder();

        if (report.getProfit() < 0) {
            recommendations.append("• Urgent action plan: analyze causes of monthly loss\n");
            recommendations.append("• Review pricing strategy and optimize operational costs\n");
        }

        double totalCost = report.getTotalCost();
        if (report.getWaterCost() > totalCost * 0.25) {
            recommendations.append("• Irrigation optimization: water cost represents ")
                    .append(percentFormat.format((report.getWaterCost() / totalCost) * 100))
                    .append("% of total costs\n");
        }

        if (report.getEnergyCost() > totalCost * 0.25) {
            recommendations.append("• Energy audit recommended: high electricity consumption\n");
        }

        if (report.getProfitMargin() < 15) {
            recommendations.append("• Improve profitability: margin below standards (15%)\n");
        }

        recommendations.append("• Analyze seasonal trends for the following month\n");
        recommendations.append("• Implement weekly monitoring indicators");

        addParagraph(document, recommendations.toString(), NORMAL_FONT);
    }
}