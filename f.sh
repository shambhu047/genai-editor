#!/bin/bash

# Set your new name and email
NEW_NAME="Shambhu"
NEW_EMAIL="mr.shambhu04@gmail.com"
# Start interactive rebase from the root, skipping the editor
GIT_SEQUENCE_EDITOR=true git rebase -i --root

# Iterate through each commit and update the author
for commit in $(git rev-list --reverse HEAD); do
    # Extract commit date and ensure it's valid
    COMMIT_DATE=$(git show -s --format=%cd --date=iso-strict "$commit")

    if [[ -z "$COMMIT_DATE" ]]; then
        echo "Skipping commit $commit due to missing date"
        continue
    fi

    # Update author information
    GIT_COMMITTER_DATE="$COMMIT_DATE" GIT_AUTHOR_DATE="$COMMIT_DATE" \
    git commit --amend --author="$NEW_NAME <$NEW_EMAIL>" --date "$COMMIT_DATE" --no-edit

    # Continue the rebase process
    git rebase --continue 2>/dev/null || true
done

# Force push the changes to the remote repository
#git push --force
