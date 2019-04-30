package io.slingr.endpoints.swiftdil;

import io.slingr.endpoints.HttpEndpoint;
import io.slingr.endpoints.exceptions.EndpointException;
import io.slingr.endpoints.exceptions.ErrorCode;
import io.slingr.endpoints.framework.annotations.ApplicationLogger;
import io.slingr.endpoints.framework.annotations.EndpointFunction;
import io.slingr.endpoints.framework.annotations.EndpointProperty;
import io.slingr.endpoints.framework.annotations.SlingrEndpoint;
import io.slingr.endpoints.services.AppLogs;
import io.slingr.endpoints.services.rest.DownloadedFile;
import io.slingr.endpoints.utils.Json;
import io.slingr.endpoints.ws.exchange.FunctionRequest;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.Base64;

/**
 * SwiftDil endpoint
 *
 * Created by dgaviola on 8/21/18.
 */
@SlingrEndpoint(name = "swiftdil", functionPrefix = "_")
public class SwiftDilEndpoint extends HttpEndpoint {
    private static final Logger logger = LoggerFactory.getLogger(SwiftDilEndpoint.class);

    private static final String SWIFTDIL_API_URL = "https://api.swiftdil.com/v1";
    private static final String SWIFTDIL_SANDBOX_API_URL = "https://sandbox.swiftdil.com/v1";

    @ApplicationLogger
    private AppLogs appLogger;

    @EndpointProperty
    private String clientId;

    @EndpointProperty
    private String clientKey;

    @EndpointProperty
    private String sandboxMode;

    private String accessToken;

    @Override
    public String getApiUri() {
        if ("no".equals(sandboxMode)) {
            return SWIFTDIL_API_URL;
        } else {
            return SWIFTDIL_SANDBOX_API_URL;
        }
    }

    @Override
    public void endpointStarted() {
        httpService().setupBasicAuthenticationHeader(clientId, clientKey);
        authorize();
    }

    @EndpointFunction(name = "_get")
    public Json get(FunctionRequest request) {
        logger.info(String.format("GET [%s]", request.getJsonParams().string("path")));
        setRequestConfig(request);
        try {
            return defaultGetRequest(request);
        } catch (EndpointException e) {
            if (e.getReturnCode() == 401) {
                authorize();
                setRequestConfig(request);
                return defaultGetRequest(request);
            }
            throw e;
        }
    }

    @EndpointFunction(name = "_put")
    public Json put(FunctionRequest request) {
        logger.info(String.format("PUT [%s]", request.getJsonParams().string("path")));
        setRequestConfig(request);
        try {
            return defaultPutRequest(request);
        } catch (EndpointException e) {
            if (e.getReturnCode() == 401) {
                authorize();
                setRequestConfig(request);
                return defaultPutRequest(request);
            }
            throw e;
        }
    }

    @EndpointFunction(name = "_patch")
    public Json patch(FunctionRequest request) {
        logger.info(String.format("PATCH [%s]", request.getJsonParams().string("path")));
        setRequestConfig(request);
        try {
            return defaultPatchRequest(request);
        } catch (EndpointException e) {
            if (e.getReturnCode() == 401) {
                authorize();
                setRequestConfig(request);
                return defaultPatchRequest(request);
            }
            throw e;
        }
    }

    @EndpointFunction(name = "_post")
    public Json post(FunctionRequest request) {
        logger.info(String.format("POST [%s]", request.getJsonParams().string("path")));
        setRequestConfig(request);
        try {
            return defaultPostRequest(request);
        } catch (EndpointException e) {
            if (e.getReturnCode() == 401) {
                authorize();
                setRequestConfig(request);
                return defaultPostRequest(request);
            }
            throw e;
        }
    }

    @EndpointFunction(name = "_delete")
    public Json delete(FunctionRequest request) {
        logger.info(String.format("DELETE [%s]", request.getJsonParams().string("path")));
        setRequestConfig(request);
        try {
            return defaultDeleteRequest(request);
        } catch (EndpointException e) {
            if (e.getReturnCode() == 401) {
                authorize();
                setRequestConfig(request);
                return defaultDeleteRequest(request);
            }
            throw e;
        }
    }

    @EndpointFunction(name = "_encodeFile")
    public Json encodeFile(FunctionRequest request) {
        logger.info("Encoding file in Base64");
        String fileId = request.getJsonParams().string("fileId");
        if (StringUtils.isBlank(fileId)) {
            throw EndpointException.permanent(ErrorCode.ARGUMENT, "File id cannot be empty");
        }
        Base64.Encoder encoder = Base64.getEncoder();
        DownloadedFile file = files().download(fileId);
        if (file == null) {
            throw EndpointException.permanent(ErrorCode.ARGUMENT, String.format("File with id [%s] was not found", fileId));
        }
        String encodedFile = null;
        try {
            encodedFile = encoder.encodeToString(IOUtils.toByteArray(file.getFile()));
        } catch (IOException e) {
            throw EndpointException.permanent(ErrorCode.GENERAL, "Cannot read file from app", e);
        }
        return Json.map().set("encodedFile", encodedFile);
    }

    private void setRequestConfig(FunctionRequest request) {
        Json body = request.getJsonParams();
        Json headers = body.json("headers");
        if (headers == null) {
            headers = Json.map();
        }
        headers.set("Authorization", "Bearer "+accessToken);
        headers.set("Content-Type", "application/json");
        body.set("headers", headers);
    }

    private synchronized void authorize() {
        Json params = Json.map();
        params.set("path", "/oauth2/token");
        params.set("headers", Json.map().set("Content-Type", "application/x-www-form-urlencoded"));
        Json request = Json.map().set("params", params);
        Json res = defaultPostRequest(new FunctionRequest(request));
        accessToken = res.string("access_token");
        logger.info("Access token were retrieved");
    }
}
