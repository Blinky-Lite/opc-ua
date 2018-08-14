/*global require,setInterval,console */
var opcua = require("node-opcua");


// Let's create an instance of OPCUAServer
var server = new opcua.OPCUAServer({
    port: 4334, // the port of the listening socket of the server
    resourcePath: "UA/gg-scale-server", // this path will be added to the endpoint resource name
     buildInfo : {
        productName: "gg-scale-server",
        buildNumber: "0001",
        buildDate: new Date(2018,8,14)
    }
});

function post_initialize() {
    console.log("initialized");
    function construct_my_address_space(server) {

        var addressSpace = server.engine.addressSpace;

        // declare a new object
        var device = addressSpace.addObject({
            organizedBy: addressSpace.rootFolder.objects,
            browseName: "gg-scale"
        });

        // add a variable named MyVariable2 to the newly created folder "MyDevice"
        var ggScaleWeight = 0.0;

        server.engine.addressSpace.addVariable({

            componentOf: device,

            nodeId: "ns=2;s=weight",

            browseName: "ggScaleWeight",

            dataType: "Double",

            value: {
                get: function () {
                    return new opcua.Variant({dataType: opcua.DataType.Double, value: ggScaleWeight });
                },
                set: function (variant) {
                    ggScaleWeight = parseFloat(variant.value);
                    return opcua.StatusCodes.Good;
                }
            }
        });
    }
    construct_my_address_space(server);
    server.start(function() {
        console.log("Server is now listening ... ( press CTRL+C to stop)");
        console.log("port ", server.endpoints[0].port);
        var endpointUrl = server.endpoints[0].endpointDescriptions()[0].endpointUrl;
        console.log(" the primary server endpoint url is ", endpointUrl );
    });
}
server.initialize(post_initialize);
