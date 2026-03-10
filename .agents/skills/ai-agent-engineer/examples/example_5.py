class TrajectoryLogger:
    """Registra todas las acciones del agente para debugging."""
    
    def log_step(self, step: int, thought: str, action: str, result: str):
        entry = {
            "step": step,
            "timestamp": datetime.utcnow().isoformat(),
            "thought": thought,
            "action": action,
            "result": result
        }
        self.trajectory.append(entry)
        
        # Log visual
        print(f"🤠 INFO STEP {step}")
        print(f"💭 THOUGHT: {thought}")
        print(f"🎬 ACTION: {action}")
        print(f"📤 OBSERVATION: {result[:200]}...")