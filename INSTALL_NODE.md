# Installing Node.js for Local Development

You have several options to install Node.js:

## Option 1: Install Node.js directly (Recommended)

Download and install from the official website:
1. Visit: https://nodejs.org/
2. Download the LTS version (v18 or v20)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```

## Option 2: Use nvm (Node Version Manager)

```bash
# Install nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Restart terminal or run:
source ~/.zshrc

# Install Node.js LTS
nvm install --lts
nvm use --lts

# Verify
node --version
npm --version
```

## Option 3: Use Homebrew (if permissions fixed)

```bash
# Fix Homebrew permissions first:
sudo chown -R $(whoami) /opt/homebrew/Cellar
sudo chown -R $(whoami) /opt/homebrew/Library

# Then install:
brew install node
```

## Option 4: Build with Docker (No Local Node.js Needed)

You can build the frontend using Docker without installing Node.js locally:

```bash
cd NewsSummariserFE

# Build using Docker
docker build -t newssummariser-fe:local .

# The built files will be in the Docker image
# You can extract them or just use the image directly
```

## After Installation

Once Node.js is installed:

```bash
cd NewsSummariserFE
npm install
npm run dev  # For local development
```

