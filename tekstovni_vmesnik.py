import random
from typing import Dict

import model


class Igra:
    igre: Dict[str, model.Vojna]

    def __init__(self):
        self.igre = dict()

    def igraObstaja(self, id_igre):
        """Ali obstaja iskana igra"""

        return self.igre.get(id_igre, None) is not None

    def odstraniZakljucene(self):
        """tole odstrani zakljucene igre"""

        for id_igre in list(self.igre.keys()):
            if self.igre[id_igre].zmagovalec() is not None:
                self.zakljuciVojno(id_igre)

    def ustvariVojno(self, stIgralcev, sirina, visina, maxStLadij):
        """tole ustvar novo igro, in vrne ID igre"""

        self.odstraniZakljucene()

        id_igre = ''.join(random.choice(string.ascii_letters) for _ in range(7))
        while self.igre.get(id_igre, None):
            ''.join(random.choice(string.ascii_letters) for _ in range(7))

        self.igre[id_igre] = model.Vojna(stIgralcev, sirina, visina, maxStLadij)

        return id_igre

    def zakljuciVojno(self, id_igre):
        """odstrani vojno"""

        self.igre.pop(id_igre, None)
        

    def vrniVojno(self, id_igre):
        """vrne id vojne ce obstajak, drgac pa None"""

        return self.igre.get(id_igre, None)

    def pridruziIgralca(self, id_igre):
        """doda igralca v igro"""

        self.igre[id_igre].pridruziIgralca()