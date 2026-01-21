"""
Database tools for LMAgent.

Provides tools for database queries and operations.
"""

from __future__ import annotations

import asyncio
import re
from typing import Any, Dict, List, Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult

logger = structlog.get_logger()


class DatabaseTool(BaseTool):
    """Execute database queries safely."""
    
    name: str = "database_query"
    description: str = "Execute SQL queries against the database"
    
    # Security settings
    read_only: bool = Field(default=True, description="Only allow SELECT queries")
    max_rows: int = Field(default=100, description="Maximum rows to return")
    
    # Dangerous patterns
    dangerous_patterns: List[str] = Field(default_factory=lambda: [
        r"\bDROP\b",
        r"\bTRUNCATE\b", 
        r"\bDELETE\s+FROM\b(?!.*\bWHERE\b)",  # DELETE without WHERE
        r"\bUPDATE\b(?!.*\bWHERE\b)",  # UPDATE without WHERE
        r"--",  # SQL comments (potential injection)
        r"/\*",  # Block comments
        r"\bEXEC\b",
        r"\bEXECUTE\b",
        r"\bxp_",  # SQL Server extended procedures
    ])
    
    async def execute(
        self,
        query: str,
        params: Optional[Dict[str, Any]] = None,
        database: str = "default"
    ) -> ToolResult:
        """
        Execute SQL query.
        
        Args:
            query: SQL query to execute
            params: Query parameters (for parameterized queries)
            database: Database name/alias to use
            
        Returns:
            ToolResult with query results
        """
        try:
            # Security checks
            if self.read_only and not self._is_read_query(query):
                return ToolResult(
                    success=False,
                    error="Only SELECT queries are allowed in read-only mode"
                )
            
            if self._is_dangerous(query):
                return ToolResult(
                    success=False,
                    error="Query blocked: contains dangerous pattern"
                )
            
            logger.info(
                "database_query_start",
                query_preview=query[:100],
                database=database
            )
            
            # Note: Actual database execution would go here
            # This is a template - implement based on your DB library
            # (asyncpg, aiomysql, sqlalchemy async, etc.)
            
            # Example implementation stub:
            """
            from app.core.database import get_async_session
            
            async with get_async_session() as session:
                result = await session.execute(text(query), params or {})
                rows = result.fetchmany(self.max_rows)
                columns = result.keys()
                
                data = [dict(zip(columns, row)) for row in rows]
                
                return ToolResult(
                    success=True,
                    data={
                        "columns": list(columns),
                        "rows": data,
                        "row_count": len(data),
                        "truncated": len(rows) >= self.max_rows
                    }
                )
            """
            
            # Placeholder response for template
            return ToolResult(
                success=True,
                data={
                    "message": "Database tool template - implement with your DB library",
                    "query": query,
                    "params": params,
                    "database": database
                },
                metadata={"implementation_needed": True}
            )
            
        except Exception as e:
            logger.error("database_query_error", error=str(e))
            return ToolResult(success=False, error=str(e))
    
    def _is_read_query(self, query: str) -> bool:
        """Check if query is read-only."""
        query_upper = query.strip().upper()
        return query_upper.startswith(("SELECT", "WITH", "EXPLAIN", "SHOW", "DESCRIBE"))
    
    def _is_dangerous(self, query: str) -> bool:
        """Check for dangerous SQL patterns."""
        query_upper = query.upper()
        for pattern in self.dangerous_patterns:
            if re.search(pattern, query_upper, re.IGNORECASE):
                logger.warning(
                    "dangerous_query_blocked",
                    pattern=pattern
                )
                return True
        return False


class DatabaseWriteTool(BaseTool):
    """Execute write operations on the database (requires confirmation)."""
    
    name: str = "database_write"
    description: str = "Execute INSERT/UPDATE/DELETE queries (requires confirmation)"
    
    requires_confirmation: bool = True
    max_affected_rows: int = Field(default=1000)
    
    async def execute(
        self,
        query: str,
        params: Optional[Dict[str, Any]] = None,
        database: str = "default",
        dry_run: bool = False
    ) -> ToolResult:
        """
        Execute write query.
        
        Args:
            query: SQL query to execute
            params: Query parameters
            database: Database name
            dry_run: If True, explain query without executing
        """
        try:
            query_upper = query.strip().upper()
            
            # Validate it's a write query
            if query_upper.startswith("SELECT"):
                return ToolResult(
                    success=False,
                    error="Use database_query for SELECT statements"
                )
            
            # Check for dangerous patterns
            if self._is_very_dangerous(query):
                return ToolResult(
                    success=False,
                    error="Query blocked: too dangerous without WHERE clause or limits"
                )
            
            logger.warning(
                "database_write_attempt",
                query_preview=query[:100],
                database=database,
                dry_run=dry_run
            )
            
            if dry_run:
                return ToolResult(
                    success=True,
                    data={
                        "dry_run": True,
                        "query": query,
                        "message": "Query validated but not executed"
                    }
                )
            
            # Actual implementation goes here
            return ToolResult(
                success=True,
                data={
                    "message": "Database write tool template - implement with your DB library",
                    "query": query
                },
                metadata={"implementation_needed": True}
            )
            
        except Exception as e:
            return ToolResult(success=False, error=str(e))
    
    def _is_very_dangerous(self, query: str) -> bool:
        """Check for very dangerous patterns."""
        query_upper = query.upper()
        
        # DELETE/UPDATE without WHERE
        if "DELETE" in query_upper and "WHERE" not in query_upper:
            return True
        if "UPDATE" in query_upper and "WHERE" not in query_upper:
            return True
        
        # DROP/TRUNCATE
        if "DROP" in query_upper or "TRUNCATE" in query_upper:
            return True
        
        return False
