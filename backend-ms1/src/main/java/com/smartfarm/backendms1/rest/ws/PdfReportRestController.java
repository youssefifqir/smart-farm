package com.smartfarm.backendms1.rest.ws;

import com.itextpdf.text.DocumentException;
import com.smartfarm.backendms1.service.facade.PdfReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

/**
 * Contrôleur REST pour la génération de rapports PDF de rentabilité
 * @author SmartFarm Team
 */
@RestController
@RequestMapping("/api/reports/pdf")
public class PdfReportRestController {

    @Autowired
    private PdfReportService pdfReportService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");

    /**
     * Génère un rapport PDF de rentabilité quotidien
     *
     * @param date Date pour le rapport (format: yyyy-MM-dd)
     * @return Fichier PDF du rapport quotidien
     */
    @GetMapping("/daily")
    public ResponseEntity<byte[]> generateDailyReport(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        try {
            byte[] pdfContent = pdfReportService.generateDailyProfitabilityReport(date);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment",
                    "rapport_quotidien_" + date.format(DATE_FORMATTER) + ".pdf");
            headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

            return new ResponseEntity<>(pdfContent, headers, HttpStatus.OK);

        } catch (DocumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(("Erreur lors de la génération du rapport: " + e.getMessage()).getBytes());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(("Erreur de paramètres: " + e.getMessage()).getBytes());
        }
    }
    @GetMapping("/monthly-pdf")
    public ResponseEntity<byte[]> generateMonthlyProfitabilityReport(
            @RequestParam int year,
            @RequestParam int month) {
        try {
            byte[] pdfBytes = pdfReportService.generateMonthlyProfitabilityReport(year, month);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("rapport-mensuel-" + year + "-" + String.format("%02d", month) + ".pdf")
                    .build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}