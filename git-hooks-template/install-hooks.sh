#!/usr/bin/env bash

# Install AI-blocking git hooks to the current repository
# Usage: Run this script from any git repository root directory

set -euo pipefail

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if we're in a git repository
if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "✖ Error: Not in a git repository."
  echo "  Please run this script from the root of a git repository."
  exit 1
fi

GIT_DIR="$(git rev-parse --git-dir)"
HOOKS_DIR="$GIT_DIR/hooks"

# Create hooks directory if it doesn't exist
mkdir -p "$HOOKS_DIR"

# Install the hooks
echo "Installing AI-blocking git hooks..."

for hook in commit-msg pre-commit pre-push; do
  if [[ -f "$HOOKS_DIR/$hook" ]]; then
    echo "  ⚠ Warning: $hook already exists, creating backup as $hook.backup"
    mv "$HOOKS_DIR/$hook" "$HOOKS_DIR/$hook.backup"
  fi

  cp "$SCRIPT_DIR/$hook" "$HOOKS_DIR/$hook"
  chmod +x "$HOOKS_DIR/$hook"
  echo "  ✓ Installed $hook"
done

echo ""
echo "✓ Successfully installed AI-blocking hooks!"
echo ""
echo "The following hooks are now active:"
echo "  • commit-msg  - Blocks AI indicators in commit messages"
echo "  • pre-commit  - Blocks AI indicators in staged file contents"
echo "  • pre-push    - Final safety check before pushing"
echo ""
echo "To uninstall, simply delete the hooks from $HOOKS_DIR"
