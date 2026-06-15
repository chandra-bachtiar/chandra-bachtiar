#!/bin/bash
# Install repo-local git hooks from the tracked .githooks/ directory.
# Run once per clone:  bash scripts/install-hooks.sh
set -e
chmod +x .githooks/pre-commit
git config core.hooksPath .githooks
echo "hooks installed -> .githooks (core.hooksPath set)"
