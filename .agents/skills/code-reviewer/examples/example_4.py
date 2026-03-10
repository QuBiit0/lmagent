# ❌ Anti-patrón: bare except
try:
    do_something()
except:
    pass

# ✅ Correcto: excepciones específicas
try:
    do_something()
except ValueError as e:
    logger.error(f"Invalid value: {e}")
    raise

# ❌ Anti-patrón: mutable defaults
def add_item(item, items=[]):
    items.append(item)
    return items

# ✅ Correcto: None default
def add_item(item, items=None):
    if items is None:
        items = []
    items.append(item)
    return items