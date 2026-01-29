package com.pasteBin.Pastebin.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public class CreatePasteRequest {
    @NotBlank
    private String content;

    @JsonProperty("expires_in_seconds")
    private Integer ttl_seconds;
    
    @JsonProperty("max_views")
    private Integer max_views;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getTtl_seconds() {
        return ttl_seconds;
    }

    public void setTtl_seconds(Integer ttl_seconds) {
        this.ttl_seconds = ttl_seconds;
    }

    public Integer getMax_views() {
        return max_views;
    }

    public void setMax_views(Integer max_views) {
        this.max_views = max_views;
    }
}
