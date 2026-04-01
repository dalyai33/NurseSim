import importlib
from types import ModuleType, SimpleNamespace


def test_gemini_get_help_works(monkeypatch):
    google_mod = ModuleType("google")
    genai_mod = ModuleType("google.genai")

    def fake_client(api_key=None):
        return SimpleNamespace(models=SimpleNamespace(generate_content=lambda **_k: SimpleNamespace(text="hint")))

    genai_mod.Client = fake_client
    google_mod.genai = genai_mod
    monkeypatch.setitem(__import__("sys").modules, "google", google_mod)
    monkeypatch.setitem(__import__("sys").modules, "google.genai", genai_mod)

    monkeypatch.setenv("GEMINI_API_KEY", "dummy")

    import backend.gemini as gemini
    importlib.reload(gemini)

    assert gemini.get_help("Hello") == "hint"


def test_gemini_get_help_handles_exception(monkeypatch):
    google_mod = ModuleType("google")
    genai_mod = ModuleType("google.genai")

    class BrokenClient:
        def __init__(self, *_a, **_kw):
            self.models = SimpleNamespace(generate_content=lambda **_k: (_ for _ in ()).throw(RuntimeError("boom")))

    genai_mod.Client = BrokenClient
    google_mod.genai = genai_mod
    monkeypatch.setitem(__import__("sys").modules, "google", google_mod)
    monkeypatch.setitem(__import__("sys").modules, "google.genai", genai_mod)

    monkeypatch.setenv("GEMINI_API_KEY", "dummy")

    import backend.gemini as gemini
    importlib.reload(gemini)

    assert gemini.get_help("Hello") is None
