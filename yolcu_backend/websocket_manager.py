# websocket_manager.py
from fastapi import WebSocket
from starlette.websockets import WebSocketState
from typing import List, Dict

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_name: str):
        await websocket.accept()
        if room_name not in self.active_connections:
            self.active_connections[room_name] = []
        self.active_connections[room_name].append(websocket)
        print(f"Bağlantı kabul edildi: Oda -> {room_name}")

    def disconnect(self, websocket: WebSocket, room_name: str):
        if room_name in self.active_connections:
            self.active_connections[room_name].remove(websocket)
            print(f"Bağlantı kesildi: Oda -> {room_name}")

    async def broadcast(self, message: str, room_name: str):
        if room_name in self.active_connections:
            for connection in self.active_connections[room_name]:
                 if connection.client_state == WebSocketState.CONNECTED:
                    await connection.send_text(message)

# Manager'ın tek bir örneğini oluşturup export ediyoruz
manager = ConnectionManager()