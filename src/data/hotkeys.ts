import type { ToolDef } from '../types';

/**
 * The hotkeys dictionary. Add a tool by pushing a new ToolDef, or extend an
 * existing one by adding groups/keys — the UI picks up changes automatically.
 */
export const TOOLS: ToolDef[] = [
  {
    id: 'nvim',
    name: 'Neovim',
    kicker: 'default keymap',
    sourceNote: 'Neovim defaults · check :help index for your version',
    accent: 'cyan',
    groups: [
      {
        name: 'Motion',
        keys: [
          { keys: 'h j k l', desc: 'Left · down · up · right' },
          { keys: 'w / b', desc: 'Next / previous word' },
          { keys: 'e', desc: 'End of word' },
          { keys: '0 / $', desc: 'Line start / end' },
          { keys: '^', desc: 'First non-blank char' },
          { keys: 'gg / G', desc: 'First / last line' },
          { keys: '{ / }', desc: 'Previous / next paragraph' },
          { keys: '%', desc: 'Matching bracket' },
          { keys: 'f / t', desc: 'Find / till char in line' },
          { keys: '; / ,', desc: 'Repeat / reverse find' },
          { keys: '⌃D / ⌃U', desc: 'Half page down / up' },
          { keys: '⌃F / ⌃B', desc: 'Page down / up' },
          { keys: 'H M L', desc: 'Top · middle · bottom of screen' },
          { keys: 'zz', desc: 'Center current line' },
        ],
      },
      {
        name: 'Editing',
        keys: [
          { keys: 'i / a', desc: 'Insert before / after cursor' },
          { keys: 'I / A', desc: 'Insert at line start / end' },
          { keys: 'o / O', desc: 'Open line below / above' },
          { keys: 'x', desc: 'Delete character' },
          { keys: 'dd / D', desc: 'Delete line / to end of line' },
          { keys: 'cc / C', desc: 'Change line / to end of line' },
          { keys: 'yy / p', desc: 'Yank line / paste after' },
          { keys: 'r', desc: 'Replace single character' },
          { keys: 'u / ⌃R', desc: 'Undo / redo' },
          { keys: '.', desc: 'Repeat last change' },
          { keys: '>> / <<', desc: 'Indent / outdent line' },
          { keys: 'J', desc: 'Join line below' },
          { keys: '~', desc: 'Toggle case' },
        ],
      },
      {
        name: 'Operators & text objects',
        keys: [
          { keys: 'diw / ciw', desc: 'Delete / change inner word' },
          { keys: 'ci"', desc: 'Change inside quotes' },
          { keys: 'ci( / ci{', desc: 'Change inside brackets' },
          { keys: 'dap / dip', desc: 'Delete a / inner paragraph' },
          { keys: 'gu / gU', desc: 'Lower / uppercase (operator)' },
          { keys: 'gcc', desc: 'Toggle comment on line' },
        ],
      },
      {
        name: 'Visual',
        keys: [
          { keys: 'v / V', desc: 'Charwise / linewise select' },
          { keys: '⌃V', desc: 'Blockwise (column) select' },
          { keys: 'gv', desc: 'Reselect last selection' },
          { keys: 'o', desc: 'Swap end of selection' },
          { keys: '> / <', desc: 'Indent / outdent selection' },
        ],
      },
      {
        name: 'Search & replace',
        keys: [
          { keys: '/ / ?', desc: 'Search forward / backward' },
          { keys: 'n / N', desc: 'Next / previous match' },
          { keys: '* / #', desc: 'Search word under cursor' },
          { keys: ':s/a/b/g', desc: 'Substitute in line' },
          { keys: ':%s/a/b/g', desc: 'Substitute in file' },
          { keys: ':noh', desc: 'Clear search highlight' },
        ],
      },
      {
        name: 'Windows & tabs',
        keys: [
          { keys: '⌃W s / v', desc: 'Split horizontal / vertical' },
          { keys: '⌃W h j k l', desc: 'Move to split' },
          { keys: '⌃W q / o', desc: 'Close / only this split' },
          { keys: 'gt / gT', desc: 'Next / previous tab' },
        ],
      },
      {
        name: 'Buffers & files',
        keys: [
          { keys: ':w / :q', desc: 'Write / quit' },
          { keys: ':wq / :q!', desc: 'Write+quit / force quit' },
          { keys: ':e', desc: 'Edit file' },
          { keys: ':bn / :bp', desc: 'Next / previous buffer' },
          { keys: '⌃O / ⌃I', desc: 'Jump back / forward' },
        ],
      },
      {
        name: 'LSP & diagnostics',
        keys: [
          { keys: 'K', desc: 'Hover documentation' },
          { keys: 'grn', desc: 'Rename symbol' },
          { keys: 'gra', desc: 'Code action' },
          { keys: 'grr', desc: 'Find references' },
          { keys: 'gri', desc: 'Go to implementation' },
          { keys: 'gO', desc: 'Document symbols' },
          { keys: ']d / [d', desc: 'Next / previous diagnostic' },
          { keys: '⌃]', desc: 'Jump to definition' },
        ],
      },
    ],
  },
  {
    id: 'ghostty',
    name: 'Ghostty',
    kicker: 'macOS defaults',
    sourceNote: 'Ghostty macOS defaults · check your installed version',
    accent: 'cyan',
    groups: [
      {
        name: 'Tabs & windows',
        keys: [
          { keys: '⌘T', desc: 'New tab' },
          { keys: '⌘N', desc: 'New window' },
          { keys: '⌘W', desc: 'Close surface' },
          { keys: '⌘⇧W', desc: 'Close window' },
          { keys: '⌘⇧] / ⌘⇧[', desc: 'Next / previous tab' },
          { keys: '⌘1…9', desc: 'Go to tab 1–9' },
        ],
      },
      {
        name: 'Splits',
        keys: [
          { keys: '⌘D', desc: 'Split right' },
          { keys: '⌘⇧D', desc: 'Split down' },
          { keys: '⌘⌥←↓↑→', desc: 'Focus split by direction' },
          { keys: '⌘⇧↵', desc: 'Zoom / unzoom split' },
          { keys: '⌘] / ⌘[', desc: 'Focus next / previous split' },
        ],
      },
      {
        name: 'Font & display',
        keys: [
          { keys: '⌘+ / ⌘−', desc: 'Increase / decrease font' },
          { keys: '⌘0', desc: 'Reset font size' },
          { keys: '⌘↵', desc: 'Toggle fullscreen' },
        ],
      },
      {
        name: 'Clipboard & scroll',
        keys: [
          { keys: '⌘C / ⌘V', desc: 'Copy / paste' },
          { keys: '⌘K', desc: 'Clear screen & scrollback' },
          { keys: '⌘⇧↑ / ⌘⇧↓', desc: 'Scroll page up / down' },
        ],
      },
      {
        name: 'Session',
        keys: [
          { keys: '⌘,', desc: 'Open config' },
          { keys: '⌘⇧,', desc: 'Reload config' },
          { keys: '⌘Q', desc: 'Quit Ghostty' },
        ],
      },
    ],
  },
  {
    id: 'git',
    name: 'Git',
    kicker: 'common commands',
    sourceNote: 'Common Git CLI commands · behavior can vary by version and config',
    accent: 'magenta',
    groups: [
      {
        name: 'Stage & commit',
        keys: [
          { keys: 'git status', desc: 'Working tree status', mono: true },
          { keys: 'git add -p', desc: 'Stage hunks interactively', mono: true },
          { keys: 'git add .', desc: 'Stage everything', mono: true },
          { keys: 'git commit -m', desc: 'Commit with message', mono: true },
          { keys: 'git commit --amend', desc: 'Amend last commit', mono: true },
          { keys: 'git restore --staged', desc: 'Unstage a file', mono: true },
        ],
      },
      {
        name: 'Branch',
        keys: [
          { keys: 'git switch -c', desc: 'Create & switch branch', mono: true },
          { keys: 'git switch', desc: 'Switch branch', mono: true },
          { keys: 'git branch -d', desc: 'Delete branch', mono: true },
          { keys: 'git branch -m', desc: 'Rename branch', mono: true },
        ],
      },
      {
        name: 'Sync',
        keys: [
          { keys: 'git fetch --all', desc: 'Fetch all remotes', mono: true },
          { keys: 'git pull --rebase', desc: 'Pull, replaying local', mono: true },
          { keys: 'git push -u origin', desc: 'Push & set upstream', mono: true },
          { keys: 'git push --force-with-lease', desc: 'Safe force push', mono: true },
        ],
      },
      {
        name: 'Inspect',
        keys: [
          { keys: 'git log --oneline --graph', desc: 'Compact history graph', mono: true },
          { keys: 'git diff --staged', desc: 'Diff staged changes', mono: true },
          { keys: 'git blame', desc: 'Line-by-line authorship', mono: true },
          { keys: 'git show', desc: 'Show a commit', mono: true },
        ],
      },
      {
        name: 'Merge & rebase',
        keys: [
          { keys: 'git merge', desc: 'Merge a branch', mono: true },
          { keys: 'git rebase -i', desc: 'Interactive rebase', mono: true },
          { keys: 'git rebase --continue', desc: 'Resume after conflict', mono: true },
          { keys: 'git cherry-pick', desc: 'Apply a commit', mono: true },
        ],
      },
      {
        name: 'Undo & stash',
        keys: [
          { keys: 'git reset --soft HEAD~1', desc: 'Undo commit, keep changes', mono: true },
          { keys: 'git reset --hard', desc: 'Discard to a ref', mono: true },
          { keys: 'git revert', desc: 'Reverse a commit', mono: true },
          { keys: 'git stash / pop', desc: 'Shelve / restore work', mono: true },
          { keys: 'git clean -fd', desc: 'Remove untracked files', mono: true },
        ],
      },
    ],
  },
  {
    id: 'herdr',
    name: 'Herdr',
    kicker: 'prefix ⌃B',
    sourceNote: 'Project-specific Herdr/tmux bindings · prefix and config may differ',
    accent: 'magenta',
    groups: [
      {
        name: 'Learn first',
        keys: [
          { keys: ['⌃B', 'c'], desc: 'New tab' },
          { keys: ['⌃B', 'v'], desc: 'Split right' },
          { keys: ['⌃B', '−'], desc: 'Split down' },
          { keys: ['⌃B', 'h j k l'], desc: 'Move between panes' },
          { keys: ['⌃B', 'w'], desc: 'Workspace navigation' },
          { keys: ['⌃B', 'q'], desc: 'Detach, leave running' },
          { keys: ['⌃B', '?'], desc: 'Show every binding' },
        ],
      },
      {
        name: 'Panes',
        keys: [
          { keys: ['⌃B', 'z'], desc: 'Zoom focused pane' },
          { keys: ['⌃B', 'x'], desc: 'Close pane' },
          { keys: ['⌃B', '⇧+h j k l'], desc: 'Swap panes' },
          { keys: ['⌃B', 'r'], desc: 'Resize mode' },
          { keys: ['⌃B', '['], desc: 'Enter copy mode' },
        ],
      },
      {
        name: 'Tabs',
        keys: [
          { keys: ['⌃B', 'n / p'], desc: 'Next / previous tab' },
          { keys: ['⌃B', '1…9'], desc: 'Jump to tab' },
          { keys: ['⌃B', '⇧T'], desc: 'Rename tab' },
          { keys: ['⌃B', '⇧X'], desc: 'Close tab' },
        ],
      },
      {
        name: 'Workspaces & session',
        keys: [
          { keys: ['⌃B', '⇧N'], desc: 'New workspace' },
          { keys: ['⌃B', '⇧W'], desc: 'Rename workspace' },
          { keys: ['⌃B', '⇧D'], desc: 'Close workspace' },
          { keys: ['⌃B', 'g'], desc: 'Goto picker' },
          { keys: ['⌃B', 'b'], desc: 'Toggle sidebar' },
        ],
      },
      {
        name: 'Copy mode',
        keys: [
          { keys: 'h j k l', desc: 'Move cursor' },
          { keys: 'w b e', desc: 'Word motions' },
          { keys: '/ / ?', desc: 'Search fwd / back' },
          { keys: 'n / N', desc: 'Repeat search' },
          { keys: 'v / Space', desc: 'Start selection' },
          { keys: 'y / ↵', desc: 'Copy selection' },
          { keys: 'q / Esc', desc: 'Leave copy mode' },
        ],
      },
    ],
  },
];
