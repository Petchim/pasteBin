package com.pasteBin.Pastebin.config;


public class ResponseResource<T> {
    private String message;
    private int responseCode;
    private String status;
    private T data;

    //  Constants for standard responses
    public static final int RESPONSE_CODE_OK = 200;
    public static final int RESPONSE_CODE_BAD_REQUEST = 400;
    public static final int RESPONSE_CODE_INTERNAL_ERROR = 500;

    public static final String STATUS_SUCCESS = "success";
    public static final String STATUS_ERROR = "error";

    public static final String MESSAGE_USER_CREATED = "User created successfully";
    public static final String MESSAGE_SERVICES_CREATED = "User Service successfully";
    public static final String MESSAGE_ERROR_OCCURRED = "An error occurred";

    // Constructors
    public ResponseResource() {}

    public ResponseResource(String message, int responseCode, String status, T data) {
        this.message = message;
        this.responseCode = responseCode;
        this.status = status;
        this.data = data;
    }

    // Getters & Setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getResponseCode() {
        return responseCode;
    }

    public void setResponseCode(int responseCode) {
        this.responseCode = responseCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }
}
