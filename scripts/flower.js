export default class Flower {
    /*
    El cromosoma de la flor sera un array de 6 posiciones enteras. 
    0- altura  del 10 al 300
    1- color de la flor  0=rojo, 1=azul y 2=amarillo
    2- color del tallo  0=verde, 1=verde y 2=verde  con distintos tonos
    3- ancho del tallo  del 5 al 15
    4- tamaño de la flor  del 20 al 80
    5- tamaño del centro de la flor  del 5 al 15
    */
    constructor (){
        this.position = 0;
        this.chromosome = [];
    }

    getPosition(){
        return this.position;
    }

    setPosition(position){
        this.position = position;
    }

    getAdaptation(){
        return this.adaptation;
    }

    setAdaptation(adaptation){
        this.adaptation = adaptation;
    }

    getChromosome() {
        return this.chromosome;
    }

    setChromosome(chromosome) {
        this.chromosome = chromosome;
    }
}