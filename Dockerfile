###############  BUILD STAGE  ###############
FROM node:20-alpine AS builder
RUN apk add --no-cache --virtual .build-deps python3 make g++ \
 && apk add --no-cache tini libc6-compat \
  && apk del .build-deps

WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build          # produces /app/dist

###############  RUNTIME STAGE  ###############
FROM caddy:2-alpine AS runner

# Environment variables (can be overridden at build or runtime)
ARG AUTH_SERVICE=auth.example.com
ARG FACILITY_SERVICE=facility.example.com
ARG DEVICE_SERVICE=device.example.com
ARG API_SERVICE=api.example.com

ENV AUTH_SERVICE=${AUTH_SERVICE}
ENV FACILITY_SERVICE=${FACILITY_SERVICE}
ENV DEVICE_SERVICE=${DEVICE_SERVICE}
ENV API_SERVICE=${API_SERVICE}

# Copy your Caddyfile into place
COPY Caddyfile /etc/caddy/Caddyfile

# Copy built assets into Caddy's default wwwdir (/srv)
COPY --from=builder /app/dist /srv

# (Optional) tini is built into Caddy's image as PID 1 already, so no extra ENTRYPOINT needed.

EXPOSE 3000

# Run Caddy with the specified configuration
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]