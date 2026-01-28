package com.pasteBin.Pastebin.dto;

import java.time.Instant;

public class PasteFetchResponse {

    private String content;
    private Integer remaining_views;
    private Instant expires_at;

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getRemaining_views() {
        return remaining_views;
    }

    public void setRemaining_views(Integer remaining_views) {
        this.remaining_views = remaining_views;
    }

    public Instant getExpires_at() {
        return expires_at;
    }

    public void setExpires_at(Instant expires_at) {
        this.expires_at = expires_at;
    }
}
