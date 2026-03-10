# Con OpenTelemetry
from opentelemetry import trace
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

tracer = trace.get_tracer(__name__)

@app.get("/users/{user_id}")
async def get_user(user_id: str):
    with tracer.start_as_current_span("get_user") as span:
        span.set_attribute("user.id", user_id)
        
        with tracer.start_as_current_span("db_query"):
            user = await db.get_user(user_id)
        
        with tracer.start_as_current_span("serialize"):
            result = serialize_user(user)
        
        return result