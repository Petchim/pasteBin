package com.pasteBin.Pastebin.controller;


import com.pasteBin.Pastebin.config.ResponseResource;
import com.pasteBin.Pastebin.dto.CreatePasteRequest;
import com.pasteBin.Pastebin.dto.CreatePasteResponse;
import com.pasteBin.Pastebin.dto.PasteFetchResponse;
import com.pasteBin.Pastebin.service.PasteServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/paste-bin/v1")
public class PasteController {

    @Autowired
    PasteServices pasteService;

    @Operation(summary = "Create a new form", description = "This API creates a new services in the system")
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Paste created successfully",
                    content = @Content(
                            mediaType = "application/json",
                            schema = @Schema(implementation = CreatePasteResponse.class)
                    )
            ),
            @ApiResponse(responseCode = "400", description = "Invalid input data", content = @Content),
            @ApiResponse(responseCode = "500", description = "Server error", content = @Content)
    })

    @PostMapping(
            value = "/create-form",
            consumes = {MediaType.APPLICATION_JSON_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseResource<CreatePasteResponse>> createPaste(
            @RequestBody CreatePasteRequest request) {

        try {

            CreatePasteResponse response = pasteService.createPaste(request);

            return ResponseEntity.ok(
                    new ResponseResource<>(
                            "Paste created successfully",
                            ResponseResource.RESPONSE_CODE_OK,
                            ResponseResource.STATUS_SUCCESS,
                            response
                    )
            );

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest().body(
                    new ResponseResource<>(
                            "Invalid input: " + e.getMessage(),
                            ResponseResource.RESPONSE_CODE_BAD_REQUEST,
                            ResponseResource.STATUS_ERROR,
                            null
                    )
            );
        }
    }


    @Operation(
            summary = "Fetch paste by id",
            description = "This API fetches a paste by id and increments the view count"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Paste fetched successfully",
                    content = @Content(
                            mediaType = MediaType.APPLICATION_JSON_VALUE,
                            schema = @Schema(implementation = PasteFetchResponse.class)
                    )
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Paste not found or expired",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
            ),
            @ApiResponse(
                    responseCode = "500",
                    description = "Server error",
                    content = @Content(mediaType = MediaType.APPLICATION_JSON_VALUE)
            )
    })

    @GetMapping(
            value = "/paste/{id}",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseResource<PasteFetchResponse>> fetchPaste(
            @PathVariable String id,
            HttpServletRequest request) {

        try {

            PasteFetchResponse response =
                    pasteService.fetchPaste(id, request);

            return ResponseEntity.ok(
                    new ResponseResource<>(
                            "Paste fetched successfully",
                            ResponseResource.RESPONSE_CODE_OK,
                            ResponseResource.STATUS_SUCCESS,
                            response
                    )
            );

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    new ResponseResource<>(
                            "Paste not found or expired",
                            404,
                            ResponseResource.STATUS_ERROR,
                            null
                    )
            );
        }
    }

    @Operation(
            summary = "View paste as HTML",
            description = "This API returns paste content as HTML and increments view count"
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Paste rendered successfully",
                    content = @Content(mediaType = MediaType.TEXT_HTML_VALUE)
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "Paste not found or expired",
                    content = @Content(mediaType = MediaType.TEXT_HTML_VALUE)
            )
    })
    @GetMapping(
            value = "/view/{id}",
            produces = MediaType.TEXT_HTML_VALUE
    )
    public ResponseEntity<String> viewPaste(
            @PathVariable String id,
            HttpServletRequest request) {

        try {

            String html = pasteService.viewPasteAsHtml(id, request);
            return ResponseEntity.ok(html);

        } catch (RuntimeException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("<h2>Paste not found or expired</h2>");
        }
    }


}
