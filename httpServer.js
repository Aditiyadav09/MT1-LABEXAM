import http from "http";
import fs from "fs";

let cart = [
  {
    id: 1,
    productName: "Mouse",
    price: 799,
    quantity: 2,
  },
  {
    id: 2,
    productName: "Keyboard",
    price: 1200,
    quantity: 1,
  },
];

const server = http.createServer((req, res) => {
  // ROUTE 1: HOME
  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Welcome to Shopping Cart</h1>");
  }

  // ROUTE 2: GET CART
  else if (req.url === "/cart" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "application/json",
    });

    res.end(JSON.stringify(cart));
  }

  // ROUTE 3: ABOUT
  else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200, {
      "Content-Type": "text/html",
    });

    res.end("<h1>Shopping Cart Management Application</h1>");
  }

  // ROUTE 4: SERVE HTML USING FS
  else if (req.url === "/home" && req.method === "GET") {
    fs.readFile("./public/index.html", "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, {
          "Content-Type": "text/plain",
        });

        res.end("Error reading HTML file");
      } else {
        res.writeHead(200, {
          "Content-Type": "text/html",
        });

        res.end(data);
      }
    });
  }

  // ROUTE 5: ADD TO CART
  else if (req.url === "/add-to-cart" && req.method === "POST") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        const product = JSON.parse(body);

        if (
          product.id === undefined ||
          !product.productName ||
          product.price === undefined ||
          product.quantity === undefined ||
          !Number.isFinite(Number(product.price)) ||
          !Number.isFinite(Number(product.quantity)) ||
          Number(product.price) < 0 ||
          Number(product.quantity) < 0 ||
          cart.some((item) => item.id === product.id)
        ) {
          res.writeHead(400, {
            "Content-Type": "application/json",
          });

          res.end(
            JSON.stringify({
              message: "Invalid product details or duplicate ID",
            }),
          );

          return;
        }

        cart.push(product);

        res.writeHead(201, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Product added successfully",
            product: product,
          }),
        );
      } catch (error) {
        res.writeHead(400, {
          "Content-Type": "application/json",
        });

        res.end(
          JSON.stringify({
            message: "Invalid JSON request",
          }),
        );
      }
    });
  }

  // INVALID ROUTE
  else {
    res.writeHead(404, {
      "Content-Type": "text/plain",
    });

    res.end("404 Page Not Found");
  }
});

server.listen(3000, () => {
  console.log("HTTP Server running at http://localhost:3000");
});
