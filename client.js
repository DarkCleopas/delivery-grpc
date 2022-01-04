const PROTO_PATH = './delivery.proto';

const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });

const protoDescriptor = grpc.loadPackageDefinition(packageDefinition).delivery;

const client = new protoDescriptor.DeliveryService("0.0.0.0:50051", grpc.credentials.createInsecure());


client.ListProducts({}, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Products:");

        const { products } = result;

        for (let i = 0; i < products.length; i++) {
            // console.log("Product:");
            console.log(products[i]);
        }
    }
});

client.AddOrder({
    "productId": 1,
    "amount": 3
    }, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Order added!");
    }
});

client.AddOrder({
    "productId": 2,
    "amount": 2
    }, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Order added!");
    }
});

client.AddOrder({
    "productId": 4,
    "amount": 1
    }, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Order added!");
    }
});


client.ListOrders({}, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Orders:");

        const { orders } = result;

        for (let i = 0; i < orders.length; i++) {
            // console.log("Order:");
            console.log(orders[i]);
        }
    }
});


client.RemoveOrder({
    "orderId": 2
    }, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Order removed!");
    }
});

client.ListOrders({}, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {
        console.log("Orders:");

        const { orders } = result;

        for (let i = 0; i < orders.length; i++) {
            // console.log("Order:");
            console.log(orders[i]);
        }
    }
});

client.FinishOrder({}, (err, result) => {
    if (err) {
        console.log("Error: " + err);
    } else {

        const { orderValue } = result;

        console.log("The order value is: $" + orderValue)
    }
});