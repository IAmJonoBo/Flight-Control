def test_model_accuracy():
    try:
        from ai-ml.models.graphcodebert.inference import infer
        result = infer("def foo(): pass")
        assert "predicted_class" in result
        assert "confidence" in result
    except Exception as e:
        assert False, f"Model inference failed: {e}"