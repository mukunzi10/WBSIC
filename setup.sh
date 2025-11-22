#!/bin/bash

set -e

echo "=========================================="
echo "WBSIC/InsurancesM Project Setup"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is installed
echo -e "${YELLOW}Checking Docker installation...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker is not installed. Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker is installed ✓${NC}"

# Check if Docker Compose is installed
echo -e "${YELLOW}Checking Docker Compose installation...${NC}"
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Docker Compose is not installed. Please install Docker Compose first.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker Compose is installed ✓${NC}"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file from template...${NC}"
    cp .env.example .env
    echo -e "${GREEN}.env file created ✓${NC}"
else
    echo -e "${YELLOW}.env file already exists${NC}"
fi

# Create SSL directory for Nginx
echo -e "${YELLOW}Setting up SSL certificates...${NC}"
mkdir -p ssl

# Generate self-signed certificate if it doesn't exist
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    echo -e "${YELLOW}Generating self-signed SSL certificate...${NC}"
    openssl req -x509 -newkey rsa:4096 -nodes -out ssl/cert.pem -keyout ssl/key.pem -days 365 \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    echo -e "${GREEN}SSL certificates generated ✓${NC}"
else
    echo -e "${GREEN}SSL certificates already exist ✓${NC}"
fi

# Verify directory structure
echo -e "${YELLOW}Verifying project structure...${NC}"
if [ ! -d server ]; then
    echo -e "${RED}Error: server directory not found${NC}"
    exit 1
fi

if [ ! -d client ]; then
    echo -e "${RED}Error: client directory not found${NC}"
    exit 1
fi
echo -e "${GREEN}Project structure verified ✓${NC}"

# Check if package.json exists in server and client
echo -e "${YELLOW}Checking package.json files...${NC}"
if [ ! -f server/package.json ]; then
    echo -e "${RED}Error: server/package.json not found${NC}"
    exit 1
fi

if [ ! -f client/package.json ]; then
    echo -e "${RED}Error: client/package.json not found${NC}"
    exit 1
fi
echo -e "${GREEN}package.json files found ✓${NC}"

# Create init-mongo.js for MongoDB initialization
echo -e "${YELLOW}Creating MongoDB initialization script...${NC}"
cat > init-mongo.js << 'EOF'
db = db.getSiblingDB('wbsic_db');

db.createCollection('users');
db.createCollection('projects');
db.createCollection('tasks');
db.createCollection('workbreakdownstructures');

db.createIndex({ email: 1 }, { unique: true }, { collection: 'users' });
db.createIndex({ projectId: 1 }, { collection: 'tasks' });
db.createIndex({ wbsId: 1 }, { collection: 'tasks' });

print('MongoDB initialization complete!');
EOF
echo -e "${GREEN}MongoDB init script created ✓${NC}"

# Build Docker images
echo -e "${YELLOW}Building Docker images...${NC}"
docker-compose build

# Start services
echo -e "${YELLOW}Starting Docker services...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Check service status
echo -e "${YELLOW}Checking service status...${NC}"
docker-compose ps

echo ""
echo "=========================================="
echo -e "${GREEN}Setup Complete! ✓${NC}"
echo "=========================================="
echo ""
echo "Access your application:"
echo -e "  Frontend:  ${GREEN}http://localhost:3000${NC}"
echo -e "  Backend:   ${GREEN}http://localhost:5000${NC}"
echo -e "  MongoDB:   ${GREEN}mongodb://admin:password@localhost:27017${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:    docker-compose logs -f [service]"
echo "  Stop:         docker-compose down"
echo "  Restart:      docker-compose restart"
echo "  Shell access: docker-compose exec [service] bash"
echo ""
echo "=========================================="