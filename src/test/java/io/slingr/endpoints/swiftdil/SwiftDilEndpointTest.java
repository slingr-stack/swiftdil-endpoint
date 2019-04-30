package io.slingr.endpoints.swiftdil;

import io.slingr.endpoints.utils.Json;
import io.slingr.endpoints.utils.tests.EndpointTests;
import io.slingr.endpoints.ws.exchange.FunctionRequest;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertNotNull;

/**
 * Created by dgaviola on 04/06/18.
 */
public class SwiftDilEndpointTest {
    private static EndpointTests test;
    private SwiftDilEndpoint endpoint;

    @Before
    public void init() throws Exception {
        test = EndpointTests.start(new io.slingr.endpoints.swiftdil.Runner(), "test.properties");
        endpoint = (SwiftDilEndpoint) test.getEndpoint();
    }

    @Test
    public void listCustomers() {
        Json request = Json.parse("{\"params\":{\"path\":\"/customers\"}}");
        Json customers = endpoint.get(new FunctionRequest(request));
        assertNotNull(customers);
    }
}
