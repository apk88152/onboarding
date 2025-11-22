# AI-Blocking Git Hooks

Git hooks that prevent AI indicators from being committed to your repository.

## What These Hooks Block

The hooks scan for over 100 AI-related patterns including:

- AI tool names (Claude, Cursor, Copilot, ChatGPT, Gemini, etc.)
- AI-related phrases ("ai-generated", "ai-assisted", "generated with", etc.)
- Model names (GPT-4, Claude Sonnet, Claude Code, etc.)
- Company names (OpenAI, Anthropic, etc.)
- Co-authorship markers (Co-Authored-By: Claude, noreply@anthropic.com, etc.)

## Installation

### For a Specific Repository

1. Navigate to the root of the repository where you want to install the hooks:

   ```bash
   cd /path/to/your/repo
   ```

2. Run the installation script:

   ```bash
   /path/to/onboarding/git-hooks-template/install-hooks.sh
   ```

   Or if you're already in the onboarding directory:

   ```bash
   ./git-hooks-template/install-hooks.sh
   ```

## How It Works

### commit-msg Hook

- Runs when you create a commit
- Scans the commit message for AI indicators
- Blocks the commit if any indicators are found

### pre-commit Hook

- Runs before the commit is created
- Scans all staged files for AI indicators
- Blocks the commit if any indicators are found in the code
- Skips binary files automatically
- Compatible with bash 3.2+ (macOS default)

### pre-push Hook

- Runs before pushing to remote
- Final safety check that scans all commits being pushed
- Checks both commit messages AND file contents
- Catches anything that might have bypassed earlier hooks

## Uninstallation

To remove the hooks from a repository:

```bash
cd /path/to/your/repo
rm .git/hooks/commit-msg .git/hooks/pre-commit .git/hooks/pre-push
```

## Testing

To verify the hooks are working:

1. Create a test file with AI indicators:

   ```bash
   echo "Generated with Claude Code" > test.txt
   git add test.txt
   git commit -m "test"
   ```

2. You should see an error message blocking the commit

3. Clean up:
   ```bash
   git reset HEAD test.txt
   rm test.txt
   ```

## Notes

- These hooks are **repository-specific** and must be installed in each repo where you want them active
- Git hooks are not tracked by git itself (they live in `.git/hooks/`)
- If you have existing hooks, the installer will create `.backup` copies
- All pattern matching is case-insensitive
