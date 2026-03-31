from backend import config, extension, wsgi


def test_empty_modules_importable():
    assert config is not None
    assert extension is not None
    assert wsgi is not None
