package com.pasteBin.Pastebin.service;

import com.pasteBin.Pastebin.dto.CreatePasteRequest;
import com.pasteBin.Pastebin.dto.CreatePasteResponse;
import com.pasteBin.Pastebin.dto.PasteFetchResponse;
import com.pasteBin.Pastebin.entity.Paste;
import com.pasteBin.Pastebin.repository.PasteRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Instant;
import java.util.UUID;
@Service
public class PasteServices {

    @Autowired
    PasteRepository pasteRepository;

    public CreatePasteResponse createPaste(CreatePasteRequest request) {

        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new IllegalArgumentException("Content is required");
        }

        Paste paste = new Paste();
        paste.setId(UUID.randomUUID().toString().substring(0, 8));
        paste.setContent(request.getContent());
        paste.setViewCount(0);
        paste.setCreatedAt(Instant.now());

        if (request.getTtl_seconds() != null) {
            paste.setExpiresAt(
                    Instant.now().plusSeconds(request.getTtl_seconds())
            );
        }

        if (request.getMax_views() != null) {
            paste.setMaxViews(request.getMax_views());
        }

        pasteRepository.save(paste);

        CreatePasteResponse response = new CreatePasteResponse();
        response.setId(paste.getId());
        response.setUrl("/p/" + paste.getId());

        return response;
    }

    public PasteFetchResponse fetchPaste(String id, HttpServletRequest request) {

        Paste paste = pasteRepository.findById(id)
                .orElseThrow(RuntimeException::new);

        Instant now = getCurrentTime(request);

        // TTL check
        if (paste.getExpiresAt() != null && now.isAfter(paste.getExpiresAt())) {
            throw new RuntimeException();
        }

        // View limit check
        if (paste.getMaxViews() != null &&
                paste.getViewCount() >= paste.getMaxViews()) {
            throw new RuntimeException();
        }

        paste.setViewCount(paste.getViewCount() + 1);
        pasteRepository.save(paste);

        PasteFetchResponse response = new PasteFetchResponse();
        response.setContent(paste.getContent());

        if (paste.getMaxViews() != null) {
            response.setRemaining_views(
                    paste.getMaxViews() - paste.getViewCount()
            );
        }

        response.setExpires_at(paste.getExpiresAt());

        return response;
    }


    private Instant getCurrentTime(HttpServletRequest request) {

        if ("1".equals(System.getenv("TEST_MODE"))) {
            String header = request.getHeader("x-test-now-ms");
            if (header != null) {
                return Instant.ofEpochMilli(Long.parseLong(header));
            }
        }
        return Instant.now();
    }


    public String viewPasteAsHtml(String id, HttpServletRequest request) {

        Paste paste = pasteRepository.findById(id)
                .orElseThrow(RuntimeException::new);

        Instant now = getCurrentTime(request);

        // TTL check
        if (paste.getExpiresAt() != null && now.isAfter(paste.getExpiresAt())) {
            throw new RuntimeException();
        }

        // View limit check
        if (paste.getMaxViews() != null &&
                paste.getViewCount() >= paste.getMaxViews()) {
            throw new RuntimeException();
        }

        paste.setViewCount(paste.getViewCount() + 1);
        pasteRepository.save(paste);

        return """
            <html>
              <head>
                <title>Paste</title>
                <style>
                  body { font-family: monospace; padding: 20px; }
                  pre { background: #f4f4f4; padding: 15px; }
                </style>
              </head>
              <body>
                <h3>Paste Content</h3>
                <pre>%s</pre>
              </body>
            </html>
            """.formatted(paste.getContent());
    }

}
