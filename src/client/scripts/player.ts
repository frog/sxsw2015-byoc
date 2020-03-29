import Vue from "vue";
import io from "socket.io-client";
import Cookies from "js-cookie";
import anime, { AnimeInstance } from "animejs";

import { SocketNamespace, SocketEvent, GameState, GameEvent, GameAction, ButtonColors } from "../../lib/enums";
import { Player } from "../../lib/interfaces";

class PlayerView {
  private viewModel: Vue;
  private socket: SocketIOClient.Socket;
  private animations: { [id: string] : AnimeInstance; } = {};

  private data: any = {
    buttons: {
      "1": { color: ButtonColors[1], isActive: false },
      "2": { color: ButtonColors[2], isActive: false },
      "3": { color: ButtonColors[3], isActive: false },
      "4": { color: ButtonColors[4], isActive: false }
    },
    player: {
      number: 0,
      errors: 0,
      lastSequenceDuration: 0
    } as Player,
    gameState: GameState.Waiting
  }

  constructor() {
    this.viewModel = new Vue({
      el: "main",
      data: this.data,
      computed: {
        isPlayerEnabled: (): boolean => {
          return (
            this.data.player.number > 0 && 
            this.data.player.errors < 3 && 
            (this.data.gameState === GameState.Waiting || this.data.gameState === GameState.Running)
          );
        }
      },
      watch: {
        player: {
          handler: (): void => {
            if (this.data.player.lastSequenceDuration > 0) {
              this.animations.sequenceCompleteAnimation.play();
            }
          },
          deep: true
        }
      },
      methods: {
        noop: (): void => {},
        onButtonDown: this.onButtonDown.bind(this),
        onButtonUp: this.onButtonUp.bind(this)
      }
    });

    this.socket = io(SocketNamespace.Player);
    this.socket.on(SocketEvent.Connect, this.socketConnected.bind(this));
    this.socket.on(GameEvent.GameStateUpdated, this.gameStateUpdated.bind(this));
    this.socket.on(GameEvent.PlayerUpdated, this.playerUpdated.bind(this));
    this.socket.on(GameEvent.GameReset, this.gameReset.bind(this));

    this.setAnimations();
  }

  private onButtonDown(id: number, e: PointerEvent): void {
    (e.target as HTMLButtonElement).setPointerCapture(e.pointerId);
    this.socket.emit(GameEvent.ButtonDown, id);
    this.data.buttons[id].isActive = true;
  }

  private onButtonUp(id: number): void {
    this.data.buttons[id].isActive = false;
  }

  private socketConnected(): void {
    this.registerPlayer();
  }

  private gameStateUpdated(gameState: GameState): void {
    this.data.gameState = gameState;
  }

  private playerUpdated(player: Player): void {
    this.data.player.number = player.number;
    this.data.player.errors = player.errors;
    this.data.player.lastSequenceDuration = player.lastSequenceDuration;
  }

  private gameReset(): void {
    this.registerPlayer();
  }

  private registerPlayer(): void {
    this.data.player.id = (localStorage.length > 0) ? localStorage.getItem("id") ?? undefined : Cookies.get("id") ?? undefined;

    this.socket.emit(GameAction.RegisterPlayer, this.data.player.id, (id: string) => {
      this.data.player.id = id;
      try {
        localStorage.setItem("id", id);
      } catch (e) {
        Cookies.set("id", id, { expires: 1 });
      }
    });
  }

  private setAnimations(): void {
    this.animations.sequenceCompleteAnimation = anime({
      targets: '#buttons button',
      autoplay: false,
      direction: "alternate",
      rotate: "360deg",
      duration: 500,
      easing: "easeInOutCubic",
      begin: (animation): void => {
        animation.animatables.forEach((animatable: any) => {
          (animatable.target as HTMLButtonElement).classList.toggle("active", true);
        });
      },
      complete: (animation): void => {
        animation.animatables.forEach((animatable: any) => {
          (animatable.target as HTMLButtonElement).classList.toggle("active", false);
        });
      }
    });
  }
}

new PlayerView();
