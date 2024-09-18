const express = require("express");
const mongoose = require("mongoose");
var cors = require("cors");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3001;

const ProductSchema = require("./schemas/ProductSchema");
const { authorization } = require("./services/authorization");

const TOKEN = "eccd804f-9eea-43c9-8950-6e12073eccf0";

const server = express();

server.use(cors());

server.use(express.json());

mongoose.connect(
  "mongodb+srv://admin:admin@cluster0.me2ho3f.mongodb.net/products-privado?retryWrites=true&w=majority&appName=Cluster0",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

server.get("/", (req, res) => {
  return res.json({
    message: "Seja bem vindo à API - Wesley Bruno!!!😉",

    auth: {
      url: "https://api-infnet-produtos-privado.vercel.app/auth",
      method: "POST",
      body: {
        email: "admin@admin.com",
        password: "123456",
      },
    },

    listagem_produtos: {
      url: "https://api-infnet-produtos-privado.vercel.app/produtos",
      method: "GET",
    },

    detalhe_produto: {
      url: "https://api-infnet-produtos-privado.vercel.app/produtos/[id]",
      method: "GET",
    },

    criacao_produto: {
      url: "https://api-infnet-produtos-privado.vercel.app/produtos",
      method: "POST",
      body: {
        nome: "Nome do produto",
        preco: 120,
        fornecedor: "Nome do fornecedor",
        url_imagem: "https:minha_imagem.com/023912j",
        descricao: "Descrição do produto",
      },
    },

    edicao_produto: {
      url: "https://api-infnet-produtos-privado.vercel.app/produtos/[id]",
      method: "PUT",
      body: {
        nome: "Nome do produto",
        preco: 120,
        fornecedor: "Nome do fornecedor",
        url_imagem: "https:minha_imagem.com/023912j",
        descricao: "Descrição do produto",
      },
    },

    remocao_produto: {
      url: "https://api-infnet-produtos-privado.vercel.app/produtos/[id]",
      method: "DELETE",
    },

    listagem_fornecedores: {
      url: "https://api-infnet-produtos-privado.vercel.app/fornecedores",
      method: "GET",
    },
  });
});

//Categories

const fornecedores = [
  {
    id: 1,
    label: "Amazon",
  },
  {
    id: 2,
    label: "Ms",
  },
  {
    id: 3,
    label: "Novatech Solutions",
  },
  {
    id: 4,
    label: "Global Supplies Co.",
  },
  {
    id: 5,
    label: "ExcelPro Services",
  },
  {
    id: 6,
    label: "OptiTech Industries",
  },
  {
    id: 7,
    label: "PrimeSource Distribution",
  },
  {
    id: 8,
    label: "EliteTrade Solutions",
  },
  {
    id: 9,
    label: "StarCorp Suppliers",
  },
  {
    id: 10,
    label: "Quantum Supplies Ltd.",
  },
  {
    id: 11,
    label: "ProLink Ventures",
  },
  {
    id: 12,
    label: "IntegraTrade Solutions",
  },
  {
    id: 13,
    label: "Outros",
  },
];

//auth
server.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const token = jwt.sign(
    {
      expiresIn: "365d",
    },
    TOKEN
  );

  if (!email || !password) {
    return res
      .status(403)
      .json({ message: "Email and password values are required" });
  }

  if (email === "admin@admin.com" && password === "123456") {
    return res.status(200).json({
      name: "Admin Unyleya",
      email,
      token,
    });
  }

  return res.status(400).json({ message: "Invalid email or password" });
});

//Fornecedores
server.get("/fornecedores", (req, res) => {
  return res.json(fornecedores);
});

//Product
server.get("/produtos", authorization, async (req, res) => {
  const products = await ProductSchema.find();
  return res.json(products);
});

server.get("/produtos/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const product = await ProductSchema.findById(id);
  return res.json(product);
});

server.post("/produtos", authorization, async (req, res) => {
  const result = await ProductSchema.create(req.body);
  return res.status(201).json(result);
});

server.put("/produtos/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const todo = await ProductSchema.findOneAndUpdate({ _id: id }, req.body);
  return res.json(todo);
});

server.delete("/produtos/:id", authorization, async (req, res) => {
  const { id } = req.params;
  const todo = await ProductSchema.deleteOne({ _id: id });
  return res.json({ message: "Successfully deleted" });
});

server.listen(PORT, () =>
  console.log("Servidor iniciado em http://localhost:" + PORT)
);
