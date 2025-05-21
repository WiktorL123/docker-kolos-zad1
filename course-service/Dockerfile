# Etap 1: build z zależnościami
ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE} AS builder

WORKDIR /app

LABEL maintainer="Maniek Ź <twoj@email.pl>"
LABEL service="course-service"

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

# Etap 2: finalny, czysty obraz
FROM ${BASE_IMAGE} AS final

WORKDIR /app

# Zmienna PORT będzie pobierana z docker-compose (.env)
# Nie ustawiamy NODE_ENV – to zrobi Compose (np. dev.override.yaml)

COPY --from=builder /app /app
COPY start.sh /start.sh
RUN chmod +x /start.sh && mkdir /status

CMD ["sh", "/start.sh"]
