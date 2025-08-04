# Contributing to NX Monorepo E2E Demo

Thank you for considering contributing! We welcome all kinds of contributions, including bug reports, feature requests, documentation improvements, and code changes.

## Working with GIT

### Rebase Instead of Merge

To keep the commit history clean and linear, always use **rebase** instead of **merge** when updating your branch with changes from the main branch. This helps avoid unnecessary merge commits and makes the project history easier to follow.

**How to rebase your branch:**

1. Fetch the latest changes from the main branch:

   ```sh
   git fetch origin
   ```

2. Rebase your branch onto the latest main:

   ```sh
   git rebase origin/main
   ```

3. If you encounter conflicts, resolve them, then continue the rebase:

   ```sh
   git add <conflicted-files>
   git rebase --continue
   ```

4. After a successful rebase, force-push your branch:

   ```sh
   git push --force-with-lease
   ```

**Why rebase?**

- Maintains a clean, linear commit history
- Makes code review and debugging easier
- Avoids unnecessary merge commits

### Pushing Code

Follow these steps to push your code:

Commands:

```bash
# Add changes to staging
git add .

# Commit changes
git commit -m "type(scope): subject" -m "Story: [ticket-id]"

# Rebase with the main branch
git fetch origin
git rebase origin/main

# Push changes
git push origin your-branch-name
```

Examples:

```bash
git add .
git commit -m "test(footer): add product client" -m "Story: US6246638"
git fetch origin
git rebase origin/main
git push origin feature/US6246638-product-client
```

### Using External Git Tools

Contributors are welcome to use external Git tools or Git integrations provided by their IDE (such as VS Code, WebStorm, etc.) to manage commits, rebases, and pushes for their convenience. Please ensure that all commits and branches still follow the guidelines outlined in this document.

---

## Commit Message Guidelines

Follow a structured format for commit messages to maintain a clear project history.

### Commit Format

```text
<type>(<scope>): <subject>
```

- **Type**: This indicates the purpose of the commit. Allowed types are: `feat`, `fix`, `docs`, `test`, `ci`.
- **Scope**: A scope provides additional context and is always in lowercase (e.g., `product`, `profile`).
- **Subject**: A concise description of the change, not starting with a capital letter and without a period at the end.

Examples Correct Commit Messages

```text
feat(auth): add captcha to login test
fix(product): resolve product service issue
docs(readme): update contribution guidelines
```

Incorrect Commit Messages

```text
update login functionality
```

### Commitlint

To ensure commit messages follow the guidelines, this project uses `commitlint`. Commitlint checks commit messages against a set of rules to maintain consistency and readability.

For more details on commitlint, refer to the [commitlint documentation](https://commitlint.js.org/guides/getting-started.html).

Commitlint is integrated with a Husky `commit-msg` hook to automatically validate commit messages during the commit process.

---

## Pre-push Checklist

Before pushing your code, ensure the following:

- Commit Verification: Verify that all commit messages follow the guidelines.
- Branch Naming: Ensure your branch name adheres to the naming conventions.
- Local Testing: Run all tests (e2e, linting) and ensure they pass.
- Up-to-date Branch: Rebase your branch with the latest changes from the `master` branch to avoid conflicts.

This practice helps in maintaining a clean and navigable commit history, facilitating easier code reviews and project maintenance.

## Post-push Guidelines

### Pre-PR Checklist (Before Opening a PR)

Before opening a PR, make sure to complete the following steps in your branch:

- [ ] Make sure your branch is up-to-date with the latest changes from `master` or the target branch
- [ ] Make sure your changes follow project guidance and coding standards defined in [README](./README.md)
- [ ] Run spell check
- [ ] Run lint (`yarn lint`) and TypeScript check (`tsc`) to ensure type safety
- [ ] Commit and push your changes to the remote branch
- [ ] Open a DRAFT PR to initiate visibility
- [ ] Perform a self-review and leave comments/questions where appropriate
- [ ] Double-check all code changes for accuracy and scope

### PR Submission Guidelines

Once you're ready to submit the PR for review (move from DRAFT to OPEN):

1. **Open a Pull Request:** Once your code is pushed, open a pull request against the master branch.

2. **Title:** Add a clear and concise summary of the change.
3. **Description:**

- Provide a detailed explanation of the changes.
- Include context about what and why something was changed.

4. **Test Evidence:**

- Attach lint and test results.
- Include Playwright screenshots for any E2E tests that were modified or added.

5. **Commit Hygiene:**

- Squash or amend commits before merging.
- Avoid redundant commits like `fix PR comment` or `address feedback` — instead, clean up your commit history to reflect meaningful changes only.
- A clean commit history makes it easier to track changes, understand context, and revert when needed.

6. **Peer Review:**

- Request reviews from teammates.
- Address any feedback before merging.
- Delete Branch: After the pull request is merged, delete the branch to keep the repository clean.

These steps help reviewers understand the context and validate that the change has been tested and verified.

### PR Size and Scope

- Keep PRs small and focused — ideally affecting 10 files or fewer.
- If your PR touches more than 10 files, provide a clear explanation for why it cannot be broken down further.

**Smaller PRs:**

- Are easier to review
- Get merged faster
- Lower the risk of introducing issues

### No Scope Creep

Avoid adding unrelated changes to an already opened PR. This can:

- Confuse reviewers
- Reset the review cycle
- Delay the merge process

Instead, create a separate PR for unrelated updates.

---

Following this process helps us maintain quality, clarity, and speed in our code reviews.

Thank you for being thoughtful in your contributions!
