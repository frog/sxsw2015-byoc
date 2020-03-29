import Vue from "vue";
import io from "socket.io-client";

import { SocketNamespace, GameState, GameEvent, GameAction } from "../../lib/enums";

class ControlView {
  private viewModel: Vue;
  private socket: SocketIOClient.Socket;

  private data: any = {
    gameState: GameState.Waiting,
    GameState
  };

  constructor() {
    this.viewModel = new Vue({
      el: "main",
      data: this.data,
      methods: {
        startGame: this.startGame.bind(this),
        startSequence: this.startSequence.bind(this),
        resetGame: this.resetGame.bind(this),
        showDebug: this.showDebug.bind(this)
      }
    });

    this.socket = io(SocketNamespace.Control);
    this.socket.on(GameEvent.GameStateUpdated, this.gameStateUpdated.bind(this));
  }

  private startGame(e: Event): void {
    this.socket.emit(GameAction.StartGame);
  }

  private startSequence(e: Event): void {
    this.socket.emit(GameAction.StartSequence);
  }

  private resetGame(e: Event): void {
    this.socket.emit(GameAction.ResetGame);
  }

  private showDebug(e: Event): void {
    this.socket.emit(GameAction.ShowDebug);
  }

  private gameStateUpdated(gameState: GameState): void {
    this.data.gameState = gameState;
  }
}

new ControlView();
