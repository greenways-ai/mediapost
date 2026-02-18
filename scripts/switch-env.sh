#!/bin/bash

# Script to switch between local and production Supabase for development

YELLOW='\033[1;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

show_help() {
    echo "Usage: ./scripts/switch-env.sh [local|prod|status]"
    echo ""
    echo "Commands:"
    echo "  local   - Switch to local Supabase (default port 54321)"
    echo "  prod    - Switch to production Supabase (LIVE DATABASE)"
    echo "  status  - Show current environment"
    echo ""
    echo "Examples:"
    echo "  ./scripts/switch-env.sh local"
    echo "  ./scripts/switch-env.sh prod"
}

switch_local() {
    echo -e "${GREEN}Switching to LOCAL Supabase...${NC}"
    
    cat > .env.local << 'EOF'
# Local Development with LOCAL Supabase
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=mypost-local

# Local Supabase (from 'supabase start')
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

VITE_SUPABASE_URL=http://localhost:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
EOF

    echo -e "${GREEN}✓ Now using LOCAL Supabase${NC}"
    echo "  URL: http://localhost:54321"
    echo ""
    echo "Make sure local Supabase is running:"
    echo "  supabase start"
}

switch_prod() {
    echo -e "${YELLOW}⚠️  WARNING: Switching to PRODUCTION Supabase${NC}"
    echo -e "${RED}This connects to LIVE production data!${NC}"
    echo ""
    read -p "Are you sure? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo "Cancelled."
        exit 0
    fi

    echo -e "${GREEN}Switching to PRODUCTION Supabase...${NC}"
    
    cat > .env.local << 'EOF'
# ⚠️  LOCAL DEVELOPMENT WITH PRODUCTION SUPABASE
# Changes affect LIVE production data!

NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=mypost-local-dev

# PRODUCTION Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qcdygnzlvahysnuelnmz.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=sb_publishable_hzsvP9ly7qKktvIGZoNVzw_f_sQ9fiS

VITE_SUPABASE_URL=https://qcdygnzlvahysnuelnmz.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_hzsvP9ly7qKktvIGZoNVzw_f_sQ9fiS
EOF

    echo -e "${GREEN}✓ Now using PRODUCTION Supabase${NC}"
    echo "  URL: https://qcdygnzlvahysnuelnmz.supabase.co"
    echo ""
    echo -e "${YELLOW}⚠️  Remember: Changes affect production data!${NC}"
}

show_status() {
    if [ ! -f .env.local ]; then
        echo "No .env.local file found. Run:"
        echo "  ./scripts/switch-env.sh local    # for local Supabase"
        echo "  ./scripts/switch-env.sh prod     # for production Supabase"
        exit 0
    fi

    current_url=$(grep "NEXT_PUBLIC_SUPABASE_URL" .env.local | cut -d'=' -f2)
    
    echo "Current environment:"
    echo ""
    
    if [[ "$current_url" == *"localhost"* ]]; then
        echo -e "${GREEN}✓ Using LOCAL Supabase${NC}"
        echo "  URL: $current_url"
        echo ""
        echo "To switch to production:"
        echo "  ./scripts/switch-env.sh prod"
    else
        echo -e "${YELLOW}⚠️  Using PRODUCTION Supabase${NC}"
        echo "  URL: $current_url"
        echo -e "${RED}  WARNING: Changes affect LIVE data!${NC}"
        echo ""
        echo "To switch to local:"
        echo "  ./scripts/switch-env.sh local"
    fi
}

# Main script
case "${1:-}" in
    local)
        switch_local
        ;;
    prod)
        switch_prod
        ;;
    status)
        show_status
        ;;
    *)
        show_help
        exit 1
        ;;
esac
