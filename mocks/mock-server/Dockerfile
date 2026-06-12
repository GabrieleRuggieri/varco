FROM node:20-alpine AS builder
WORKDIR /app
COPY mocks/mock-server/package.json ./
RUN npm install
COPY mocks/mock-server/tsconfig.json ./
COPY mocks/mock-server/src ./src
COPY fixtures ./fixtures
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
RUN apk add --no-cache wget
ENV NODE_ENV=production
ENV FIXTURES_DIR=/app/fixtures
COPY mocks/mock-server/package.json ./
RUN npm install --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/fixtures ./fixtures
EXPOSE 4010
CMD ["node", "dist/index.js"]
