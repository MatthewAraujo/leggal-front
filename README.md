# Leggal Frontend - ReactJS

Este é o frontend do projeto **Leggal**, desenvolvido com **ReactJS** e configurado para se conectar ao backend via variáveis de ambiente.

---

## Pré-requisitos

* **Node.js 22**
* **pnpm** instalado globalmente

---

## Setup do Projeto

1. **Instalar dependências**

```bash
pnpm install
```

---

2. **Configurar variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto (ou copie o `.env.example`) e configure:

```env
REACT_APP_VERSION=$npm_package_version
REACT_APP_API_URL=http://localhost:3333
```

* `REACT_APP_API_URL` deve apontar para a URL do backend (ex.: localhost durante desenvolvimento ou URL do Railway em produção).
* `REACT_APP_VERSION` será preenchido automaticamente a partir do `package.json`.

---

3. **Rodar o projeto em modo de desenvolvimento**

```bash
pnpm dev
```

O aplicativo será iniciado e estará disponível por padrão em:

```
http://localhost:3000
```

---

## Observações

* Certifique-se de que o backend esteja rodando e acessível na URL configurada em `REACT_APP_API_URL`.
* Para produção, configure `REACT_APP_API_URL` apontando para o backend deployado.
