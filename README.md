# 🧐 Platforma Kursowa – mikroserwisowa architektura z Docker Compose

Projekt przedstawia mikroserwisową platformę edukacyjną, opartą na Dockera, z założeniem rozdzielenia logiki aplikacyjnej na niezależne komponenty:

---

## 📁 Struktura katalogów

```
docker-kolos-zad1/
├── compose/
│   └── docker-compose.yaml
├── course-service/
│   ├── app.js
│   ├── Dockerfile
│   └── ...
├── user-service/
│   ├── app.js
│   ├── Dockerfile
│   └── ...
├── gateway/
│   ├── default.conf
│   └── public/
│       └── index.html
├── secrets/
│   └── db_password.txt
└── .env
```

---

## 🧱 Użyte technologie

| Warstwa      | Technologia                          |
| ------------ | ------------------------------------ |
| Backend      | Node.js (Express)                    |
| Bazy danych  | PostgreSQL + MongoDB                 |
| API Gateway  | Nginx (proxy + serwowanie statyczne) |
| Orkiestracja | Docker Compose                       |

---

## 🧹 Mikroserwisy

### 1. `course-service`

* **Cel:** zarządzanie kursami (CRUD).
* **Baza:** PostgreSQL.
* **Port:** 3001.
* **Endpoints:**

    * `GET /courses`
    * `POST /courses`
    * `DELETE /courses/:id`
    * `PUT /courses/:id`
* **Tabela:** `courses(id, title, description)`
* **Healthcheck:** `/health` → `200 OK`

---

### 2. `user-service`

* **Cel:** zarządzanie użytkownikami (CRUD).
* **Baza:** MongoDB.
* **Port:** 3002.
* **Endpoints:**

    * `GET /users`
    * `POST /users`
    * `DELETE /users/:id`
    * `PUT /users/:id`
* **Kolekcja:** `users`
* **Healthcheck:** `/health` → `200 OK`

---

### 3. `api-gateway`

* **Cel:** reverse proxy + serwowanie statycznego frontu.
* **Technologia:** Nginx (`nginx:alpine`)
* **Port:** 3000
* **Routing:**

    * `/courses` → `course-service:3001`
    * `/users` → `user-service:3002`
    * `/` → serwowanie `gateway/public/index.html`

---

### 4. Bazy danych

* **PostgreSQL**

    * Wersja: `15`
    * Dane logowania z `.env` i sekreta
    * Wolumen: `pgdata`
* **MongoDB**

    * Wersja: `mongo:6-jammy`
    * Wolumen: `mongodata`

---

## 🔒 Sekrety

Zamiast podawania hasła do PostgreSQL jako zwykłej zmiennej środowiskowej, użyto **Docker secrets**:

```yaml
POSTGRES_PASSWORD: /run/secrets/db_password
```

---

## 🔄 Healthchecki

Każda usługa posiada healthcheck (np. `pg_isready`, `wget` na `/health`), aby wspierać poprawne `depends_on: condition: service_healthy`.

---

## 🥪 Testowanie

Aplikację można testować z poziomu przeglądarki lub narzędzi takich jak Postman:

* `http://localhost:3000/courses`
* `http://localhost:3000/users`

---

## 🔌 Uruchamianie

Z katalogu głównego:

```bash
docker compose --env-file .env -f compose/docker-compose.yaml up --build
```

> Wymagany plik `.env` z portami, użytkownikami i nazwami baz danych.

---

## ✅ Przykładowe dane `.env`

```env
POSTGRES_USER=admin
POSTGRES_DB=courses
POSTGRES_PORT=5432
POSTGRES_PASSWORD=secret
POSTGRES_HOST=database

MONGO_URI=mongodb://mongo:27017
MONGO_PORT=27017
MONGO_HOST=mongo

COURSE_SERVICE_PORT=3001
USER_SERVICE_PORT=3002
API_GATEWAY_PORT=3000
```

---

## 🧼 Wskazówki

* Przed ponownym uruchomieniem możesz oczyścić kontenery i wolumeny:

```bash
docker compose down -v
```

---

##
