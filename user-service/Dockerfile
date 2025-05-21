# Etap 1: Budowanie zależności
ARG BASE_IMAGE=node:20-alpine
FROM ${BASE_IMAGE} AS builder

WORKDIR /app

LABEL maintainer="Maniek Ź <twoj@email.pl>"
LABEL service="user-service"

COPY package.json package-lock.json* ./
RUN npm install --production

COPY . .

# Etap 2: Produkcyjny, czysty obraz
FROM ${BASE_IMAGE} AS final

WORKDIR /app

COPY --from=builder /app /app
COPY start.sh /start.sh
RUN chmod +x /start.sh && mkdir /status

CMD ["sh", "/start.sh"]
