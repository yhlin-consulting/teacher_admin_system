FROM mcr.microsoft.com/devcontainers/typescript-node:4-22-bookworm

# Install extra tools
RUN apt-get update && apt-get install -y git curl
