export enum SocketNamespace {
  Player = "/player",
  Board = "/board",
  Control = "/control"
}

export enum SocketEvent {
  Connect = "connect",
  Disconnect = "disconnect",
  Reconnect = "reconnect",
  Error = "error"
}

export enum GameState {
  Waiting,
  Ready,
  Starting,
  Running,
  Completed
}

export enum GameEvent {
  GameStateUpdated = "GameStateUpdated",
  PlayersUpdated = "PlayersUpdated",
  PlayerUpdated = "PlayerUpdated",
  ButtonDown = "ButtonDown",
  ButtonUp = "ButtonUp",
  SequenceStarted = "SequenceStarted",
  SequenceCompleted = "SequenceCompleted",
  SequenceWon = "SequenceWon",
  GameWon = "GameWon",
  GameReset = "GameReset"
}

export enum GameAction {
  RegisterPlayer = "RegisterPlayer",
  StartGame = "StartGame",
  StartSequence = "StartSequence",
  RunSequence = "RunSequence",
  ResetGame = "ResetGame",
  ShowDebug = "ShowDebug"
}

export enum ButtonColors {
  green = 1,
  red = 2,
  yellow = 3,
  blue = 4
}
