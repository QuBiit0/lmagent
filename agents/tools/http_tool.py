"""
HTTP request tool for LMAgent.

Allows agents to make HTTP requests to external APIs.
"""

from __future__ import annotations

import asyncio
import json
from typing import Any, Dict, Optional

from pydantic import Field
import structlog

from .base_tool import BaseTool, ToolResult

logger = structlog.get_logger()

# Try to import httpx, fall back to aiohttp
try:
    import httpx
    HTTP_CLIENT = "httpx"
except ImportError:
    try:
        import aiohttp
        HTTP_CLIENT = "aiohttp"
    except ImportError:
        HTTP_CLIENT = None


class HttpTool(BaseTool):
    """Make HTTP requests to external APIs."""
    
    name: str = "http_request"
    description: str = "Make HTTP requests to APIs"
    
    # Configuration
    timeout_seconds: int = Field(default=30)
    max_response_size: int = Field(default=1_000_000)  # 1MB
    
    # Security: blocked URL patterns
    blocked_patterns: list = Field(default_factory=lambda: [
        "169.254.169.254",  # AWS metadata
        "metadata.google.internal",  # GCP metadata
        "localhost",
        "127.0.0.1",
        "0.0.0.0",
    ])
    
    async def execute(
        self,
        url: str,
        method: str = "GET",
        headers: Optional[Dict[str, str]] = None,
        body: Optional[Any] = None,
        params: Optional[Dict[str, str]] = None
    ) -> ToolResult:
        """
        Make HTTP request.
        
        Args:
            url: Full URL to request
            method: HTTP method (GET, POST, PUT, DELETE, PATCH)
            headers: Request headers
            body: Request body (will be JSON-encoded for POST/PUT)
            params: Query parameters
            
        Returns:
            ToolResult with response data
        """
        try:
            # Security check
            if self._is_blocked_url(url):
                return ToolResult(
                    success=False,
                    error="URL blocked for security reasons"
                )
            
            method = method.upper()
            if method not in ("GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"):
                return ToolResult(
                    success=False,
                    error=f"Invalid HTTP method: {method}"
                )
            
            logger.info(
                "http_request_start",
                method=method,
                url=url[:100]
            )
            
            if HTTP_CLIENT == "httpx":
                return await self._request_httpx(url, method, headers, body, params)
            elif HTTP_CLIENT == "aiohttp":
                return await self._request_aiohttp(url, method, headers, body, params)
            else:
                return ToolResult(
                    success=False,
                    error="No HTTP client available. Install httpx: pip install httpx"
                )
                
        except Exception as e:
            logger.error("http_request_error", error=str(e))
            return ToolResult(success=False, error=str(e))
    
    async def _request_httpx(
        self,
        url: str,
        method: str,
        headers: Optional[Dict],
        body: Optional[Any],
        params: Optional[Dict]
    ) -> ToolResult:
        """Make request using httpx."""
        import httpx
        
        async with httpx.AsyncClient(timeout=self.timeout_seconds) as client:
            kwargs = {
                "method": method,
                "url": url,
                "headers": headers or {},
                "params": params,
            }
            
            if body and method in ("POST", "PUT", "PATCH"):
                if isinstance(body, (dict, list)):
                    kwargs["json"] = body
                else:
                    kwargs["content"] = str(body)
            
            response = await client.request(**kwargs)
            
            return self._parse_response(response.status_code, response.headers, response.text)
    
    async def _request_aiohttp(
        self,
        url: str,
        method: str,
        headers: Optional[Dict],
        body: Optional[Any],
        params: Optional[Dict]
    ) -> ToolResult:
        """Make request using aiohttp."""
        import aiohttp
        
        async with aiohttp.ClientSession() as session:
            kwargs = {
                "method": method,
                "url": url,
                "headers": headers or {},
                "params": params,
                "timeout": aiohttp.ClientTimeout(total=self.timeout_seconds)
            }
            
            if body and method in ("POST", "PUT", "PATCH"):
                if isinstance(body, (dict, list)):
                    kwargs["json"] = body
                else:
                    kwargs["data"] = str(body)
            
            async with session.request(**kwargs) as response:
                text = await response.text()
                return self._parse_response(response.status, dict(response.headers), text)
    
    def _parse_response(
        self,
        status_code: int,
        headers: Dict,
        text: str
    ) -> ToolResult:
        """Parse HTTP response into ToolResult."""
        # Truncate if too large
        if len(text) > self.max_response_size:
            text = text[:self.max_response_size] + "\n... (truncated)"
        
        # Try to parse as JSON
        json_data = None
        try:
            json_data = json.loads(text)
        except json.JSONDecodeError:
            pass
        
        is_success = 200 <= status_code < 300
        
        return ToolResult(
            success=is_success,
            data={
                "status_code": status_code,
                "headers": dict(headers),
                "body": json_data if json_data else text,
                "is_json": json_data is not None
            },
            error=f"HTTP {status_code}" if not is_success else None
        )
    
    def _is_blocked_url(self, url: str) -> bool:
        """Check if URL should be blocked."""
        url_lower = url.lower()
        return any(pattern in url_lower for pattern in self.blocked_patterns)
