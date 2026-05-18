#!/bin/bash
# Quick local server for Tiltboard
# Run from the Total Gym App directory: bash serve.sh
echo "Starting Tiltboard on http://localhost:8080"
echo "Open this in your browser, then use 'Share → Add to Home Screen' on iPhone"
echo ""
cd "$(dirname "$0")"
python3 -m http.server 8080
