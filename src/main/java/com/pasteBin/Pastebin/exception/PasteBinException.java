package com.pasteBin.Pastebin.exception;

public class PasteBinException extends RuntimeException {
    public PasteBinException(String message) {
        super(message);
    }
    public PasteBinException(String message, Throwable cause) {
        super(message, cause);
    }

}
