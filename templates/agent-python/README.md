# LMAgent Python Agent Template

Este template proporciona la estructura base para crear agentes de IA con LMAgent.

## Estructura

```
agent_name/
├── __init__.py
├── config.yaml           # Configuración del agente
├── agent.py              # Clase principal del agente
├── prompts/
│   └── system.md         # System prompt del agente
├── tools/
│   ├── __init__.py
│   └── custom_tool.py    # Herramientas específicas
└── tests/
    └── test_agent.py     # Tests del agente
```

## Uso

1. Copiar este directorio
2. Renombrar a tu agente
3. Configurar `config.yaml`
4. Personalizar `prompts/system.md`
5. Agregar herramientas específicas si es necesario
6. Escribir tests

## Archivos

### config.yaml

Define la configuración del agente:
- Modelo LLM a usar
- Herramientas disponibles
- Límites de costo/iteraciones
- Guardrails

### agent.py

Clase principal que implementa:
- Inicialización con configuración
- Método `run()` para ejecutar el agente
- Integración con tools y prompts

### prompts/system.md

System prompt que define:
- Rol y responsabilidades
- Herramientas disponibles
- Formato de respuestas
- Restricciones
