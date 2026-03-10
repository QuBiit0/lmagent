from lmagent.tools.base import Tool
from pydantic import Field
from typing import Optional

class SearchDatabaseTool(Tool):
    """
    Busca información en la base de datos del proyecto.
    
    Usa esta herramienta cuando necesites:
    - Buscar usuarios por email o nombre
    - Obtener datos de órdenes
    - Consultar productos
    """
    name: str = "search_database"
    description: str = "Search project database for information"
    
    async def execute(
        self,
        query: str = Field(..., description="Natural language query"),
        table: Optional[str] = Field(None, description="Specific table to search"),
        limit: int = Field(10, description="Max results to return")
    ) -> dict:
        """
        Ejecuta búsqueda en la base de datos.
        
        Returns:
            dict with 'results' array and 'count' integer
        """
        try:
            # Implementación
            results = await self._search(query, table, limit)
            return {
                "success": True,
                "results": results,
                "count": len(results)
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "suggestion": "Try a more specific query"
            }