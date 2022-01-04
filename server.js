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

const deliveryService = protoDescriptor.DeliveryService;

const server = new grpc.Server();

let { products } = require('./db.js');

let orders = [];


server.addService(deliveryService.service, {
    ListProducts: (call, callback) => {
        callback(null, { products: products });
    },

    AddOrder: (call, callback) => {

        const { productId, amount } = call.request;
        orders.push({"productId": productId, "amount": amount});

        console.log("Order added!");

        callback(null, {});
    },

    ListOrders: (call, callback) => {
        callback(null, { orders: orders });
    },

    RemoveOrder: (call, callback) => {
        const id = call.request.orderId;
        orders = orders.filter(({ productId }) => productId !== id);

        console.log("Order removed!");

        callback(null, { orderId: id });
    },

    FinishOrder: (call, callback) => {

        let orderValue = 0

        for (let i = 0; i < orders.length; i++) {
            
            let product = products.find(({ id }) =>  orders[i].productId == id);
            orderValue = orderValue + (orders[i].amount * product.value);
        }

        orders = [];

        callback(null, { orderValue: orderValue });
    },


    // RealizarPedido: (call, callback) => {
    //     const pedido = call.request;
    //     const valorTotal = pedido.pizza.preco * pedido.quantidade;

    //     bd.pedidos.push(pedido);

    //     callback(null, { valorTotal });
    // },

    // ListarPedidos: (call, callback) => {
    //     callback(null, { pedidos: bd.pedidos });
    // },
});

// server.bindAsync("0.0.0.0:50051", grpc.ServerCredentials.createInsecure(), (error, port) => {
//     console.log("Servidor gRPC rodando!");
//     server.start();
// });

server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    (error, port) => {
      console.log("Server at port:", port);
      console.log("Server running at http://0.0.0.0:50051");
      server.start();
    }
  );