<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Agent Rules

1. **Pre-Edit Sync**: Auto-commit existing pending changes
   using Conventional Commits and run `git pull` _before_
   modifying files. Include the uncommented `git status`
   file list in the commit message.
2. **Post-Edit Review**: Do NOT commit your new edits; leave
   them pending for my review. Ask for approval before
   deleting files or altering core architecture.
3. **Clean Code**: TS strict mode, single quotes, functional
   patterns. Brief JSDocs only for complex types/returns.
4. **Water Tracker**: Append a 1-line footprint estimate to
   final summaries.
