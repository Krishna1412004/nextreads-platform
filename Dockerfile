# Stage 1: Build application
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest AS builder

USER root
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production runtime with non-root security
FROM registry.access.redhat.com/ubi9/nodejs-20-minimal:latest AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Use default unprivileged user provided by UBI minimal image
USER 1001

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3000

CMD ["npm", "start"]
