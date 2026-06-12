FROM node:20-slim AS build
WORKDIR /app
COPY packages/shared/ ./packages/shared/
COPY frontend/package.json frontend/pnpm-lock.yaml* ./frontend/
COPY pnpm-workspace.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile 2>/dev/null || pnpm install
COPY frontend/ ./frontend/
RUN cd frontend && pnpm build

FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
