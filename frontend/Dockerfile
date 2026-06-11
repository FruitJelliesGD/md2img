FROM node:20-slim AS build
WORKDIR /app
COPY frontend/package.json frontend/pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY frontend/ .
RUN pnpm build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
