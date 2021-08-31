import enum
from typing import List

class Polje(enum.Enum):
    Morje    = b'.'
    Ladja    = b'#'
    Zadeto   = b'X'
    Zgreseno = b'O'

    

class Bojisce:
    polja: List[List[Polje]]

    def __init__(self, sirina, visina):
        self.sirina = visina
        self.visina = sirina
        self.stLadij = 0
        self.polja = [ [Polje.Morje] * self.sirina for _ in range(self.visina) ]
    
    def postaviLadjo(self, x, y, n, smer):