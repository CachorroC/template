#!/bin/bash

# Define colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo -e "► Starting docker compose build..."

# Run build
if docker compose build; then
    echo -e "${GREEN}► Build successful! Restarting containers...${NC}"
    docker compose down
    docker compose up -d
    echo -e "${GREEN}► Application restarted successfully!${NC}"
else
    # Trigger a console error
    echo -e "${RED}====================================================${NC}"
    echo -e "${RED}✖ ERROR: Docker compose build failed!${NC}"
    echo -e "${RED}  There was an error in the script. The process has ${NC}"
    echo -e "${RED}  been stopped before bringing down the containers. ${NC}"
    echo -e "${RED}====================================================${NC}"
    
    # Try to trigger an alert popup using common Linux display utilities
    if command -v notify-send &> /dev/null; then
        notify-send -u critical "Docker Build Failed" "There was an error in the script. Docker compose build failed and execution was stopped."
    elif command -v zenity &> /dev/null; then
        zenity --error --text="There was an error in the script. Docker compose build failed and execution was stopped." --title="Docker Build Failed" &
    elif command -v kdialog &> /dev/null; then
        kdialog --error "There was an error in the script. Docker compose build failed and execution was stopped." --title "Docker Build Failed" &
    else
        # Fallback to visual terminal bell if no popup tool is available
        echo -e '\a'
    fi

    # Exit with an error code
    exit 1
fi
