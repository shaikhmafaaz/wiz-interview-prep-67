
#!/bin/bash

echo "Building Docker image for Interview-Wiz-Guide..."

# Build the Docker image
docker build -t interview-wiz-guide .

echo "Build complete! You can now run the application with:"
echo "docker-compose up -d"
echo ""
echo "Or run directly with:"
echo "docker run -p 3000:80 -v $(pwd)/backend/database:/app/backend/database interview-wiz-guide"
echo ""
echo "The application will be available at http://localhost:3000"
