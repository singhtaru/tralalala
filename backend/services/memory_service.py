from collections import defaultdict
import time

_SESSION_STATE = defaultdict(dict)


def get_session_state(session_id: str = "default") -> dict:
    state = _SESSION_STATE[session_id]
    if state and "updated_at" in state:
        if time.time() - state["updated_at"] > 1800:
            clear_session_state(session_id)
            return _SESSION_STATE[session_id]
    return state


def update_session_state(session_id: str, state: dict) -> None:
    state["updated_at"] = time.time()
    _SESSION_STATE[session_id] = state


def clear_session_state(session_id: str = "default") -> None:
    _SESSION_STATE.pop(session_id, None)
