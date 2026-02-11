#!/bin/bash
# Sandbox entrypoint script
# Executes code in a restricted environment

set -e

# Set timeout (default 60 seconds)
TIMEOUT=${TIMEOUT:-60}

# Execute command with timeout
timeout $TIMEOUT "$@"
