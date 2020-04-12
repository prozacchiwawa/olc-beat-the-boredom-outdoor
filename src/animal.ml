type wolfAttitude
  = WolfScared of ((int * int) list * float)
  | WolfStalk of ((int * int) list * float)
  | WolfAttack of float
  | WolfIdle

type wolfState =
  { attitude : wolfAttitude
  }

type deerAttitude
  = DeerScared of ((int * int) list * float)
  | DeerStalk of ((int * int) list * float)
  | DeerEat of float

type deerState =
  { attitude : deerAttitude
  }

type game
  = Wolf of wolfState
  | Deer of deerState

type activeGame =
  { kind : game
  ; x : float
  ; y : float
  }

type animalUpdate
  = AnimalMoved of activeGame
  | AnimalAtePlayer
  | AnimalDied of float
