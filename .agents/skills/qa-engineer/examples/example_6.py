import pytest
from deepeval import assert_test
from deepeval.metrics import FaithfulnessMetric, AnswerRelevancyMetric
from deepeval.test_case import LLMTestCase

class TestAgentQuality:
    
    def test_rag_faithfulness(self, agent_rag):
        """Asegura que el agente no alucine información fuera de su knowledge base."""
        
        query = "Políticas de reembolso"
        context = ["Reembolsos solo en 30 días."]
        
        # Ejecutar agente
        actual_output = agent_rag.query(query)
        
        # Definir caso de prueba
        test_case = LLMTestCase(
            input=query,
            actual_output=actual_output,
            retrieval_context=context
        )
        
        # Métrica: Fidelidad
        metric = FaithfulnessMetric(threshold=0.7)
        
        # Assert usando otro LLM como juez
        assert_test(test_case, [metric])

    def test_tool_selection_determinism(self, agent):
        """El agente debe elegir SIEMPRE 'calculator' para sumas."""
        for _ in range(5):
            plan = agent.plan("Cuánto es 50 + 20")
            assert plan.tool == "calculator", f"Falló en intento {_}"