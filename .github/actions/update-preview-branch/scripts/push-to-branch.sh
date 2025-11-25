#!/bin/bash
set -euo pipefail

BRANCH_NAME=${GITHUB_REF#refs/heads/}
echo "[INFO] Pushing branch: $BRANCH_NAME → preview"

git fetch origin preview:preview 2>/dev/null || true

if git show-ref --verify --quiet refs/heads/preview; then
    git branch -D preview 2>/dev/null || true
fi

git checkout -b preview origin/preview 2>/dev/null || git checkout -b preview

git reset --hard origin/$BRANCH_NAME

git push origin preview --force
