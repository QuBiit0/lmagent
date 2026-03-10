# 1. Crear release branch (si usas Git Flow)
git checkout -b release/2.4.0 develop

# 2. Bump version
npm version minor  # o major/patch

# 3. Preparar changelog
# Automáticamente con conventional commits

# 4. Merge a main
git checkout main
git merge --no-ff release/2.4.0

# 5. Tag
git tag -a v2.4.0 -m "Release v2.4.0: descripción"

# 6. Merge back a develop
git checkout develop
git merge --no-ff release/2.4.0

# 7. Push todo
git push origin main develop --tags

# 8. Eliminar release branch
git branch -d release/2.4.0