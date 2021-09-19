import Flower from "./flower.js";
import Utils from "./utils.js";
import { STEM_COLOR, FLOWER_COLOR, FLOWER_CENTER_COLOR } from "./enums/colors.js";

export default class Evolution {
    constructor(){
        this.population = [];
        this.generation = 0;
        this.parentA = null;
        this.parentB = null;
        this.initializePolulation();
    }

    execute(){
        setInterval(() => {
            this.adaptation();

            this.chooseParents();

            this.crossover();

            this.generation++;

            this.draw();

        }, 2000);
    }

    initializePolulation() {
        const utils = new Utils();
        for (let n = 0; n < 10; n++) {
            const flower = new Flower();
            flower.setPosition(n*80 + 120);
            // armamos el cromosoma random
            const height = utils.getRandomArbitrary(10, 300);
            const flowerColor = utils.getRandomArbitrary(0, 3);
            const stemColor = utils.getRandomArbitrary(0, 3);
            const stemWidth = utils.getRandomArbitrary(5, 15);
            const flowerSize = utils.getRandomArbitrary(20, 80);
            const widthCenterFlower = utils.getRandomArbitrary(5, 15);

            let chromosome = [height, flowerColor, stemColor, stemWidth, flowerSize, widthCenterFlower];
            flower.setChromosome(chromosome);
            this.population.push(flower);
        }
        this.draw();
    }

    draw() {
        this.clearCanvas();
        for (let n = 0; n < 10; n++) {
            const flower = this.population[n];
            console.log(flower)
            const chromosome = flower.getChromosome();

            // TALLO
            const dStem = {
                x: flower.getPosition(),
                y: 550 - chromosome[0],
                width: chromosome[3],
                height: chromosome[0],
                radius: 0,
                color: STEM_COLOR[chromosome[2]],
            };

            this.drawRectangle(dStem);

            // CIRCULO
            const dFlower = {
                x: (flower.getPosition() + (chromosome[3]/2)),
                y: 550 - chromosome[0],
                radius: chromosome[4],
                color: FLOWER_COLOR[chromosome[1]],
            };
            this.drawCircle(dFlower);

            // CENTRO
            const dFlowerCenter = {
                x: flower.getPosition() + (chromosome[3]/2),
                y: 550 - chromosome[0],
                radius: chromosome[5],
                color: FLOWER_CENTER_COLOR,
            };
            this.drawCircle(dFlowerCenter);

            
        }
        // INFO DE LA GENERACION
        document.getElementById('generation').innerText = `Generacion ${this.generation}`;
    }

    clearCanvas() {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d'); 
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    drawCircle({ x, y, radius, color }) {
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d'); 
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.lineWidth = 3;
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.fill();
        ctx.stroke();
    }

    drawRectangle({ x, y, width, height, color }) {
        var drawing = document.getElementById("canvas");
        var ctx = drawing.getContext("2d");
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        // strokeRect(x, y, w, h):
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }


    adaptation() {
        const ui = this.getUserNeeds();
        let heightCurrent = 0;
        let colorCurrent = 0;
        let sizeCurrent = 0;

        for (let n = 0; n < 10; n++) {
            const flower = this.population[n];
            const chromosome = flower.getChromosome();
            switch (ui.height) {
                case 'high':
                    heightCurrent = chromosome[0]/300;
                    break;
                case 'medium':
                    heightCurrent = chromosome[0]/200;
                    break;
                case 'low':
                    heightCurrent = chromosome[0]/100;
                    break;
            }

            if (heightCurrent > 1) {
                heightCurrent = 1 / heightCurrent;
            }
            console.log(ui.color + " === " + FLOWER_COLOR[chromosome[1]])
            if (ui.color === FLOWER_COLOR[chromosome[1]]) {
                colorCurrent = 1;
            }

            switch (ui.size) {
                case 'small':
                    sizeCurrent = chromosome[4]/40;
                    break;
                case 'normal':
                    sizeCurrent = chromosome[4]/60;
                    break;
                case 'large':
                    sizeCurrent = chromosome[4]/80;
                    break;
            }

            if (sizeCurrent > 1) {
                sizeCurrent = 1 / sizeCurrent;
            }

            flower.setAdaptation((heightCurrent+colorCurrent+sizeCurrent)/3);
            this.population[n] = flower;
        }
        
    }

    chooseParents() {
        // modelo elitista
        let iParentA = 0;
        let iParentB = 0;

        for (let n = 0; n < 10; n++) {
            if (this.population[n].getAdaptation() > this.population[iParentA].getAdaptation()) {
                iParentA = n;
            }
        }
        this.parentA = iParentA;

        for (let n = 0; n < 10; n++) {
            if ((this.population[n].getAdaptation() > this.population[iParentB].getAdaptation()) && iParentA !== n) {
                iParentB = n;
            }
        }
        this.parentB = iParentB;
    }

    crossover() {
        const utils = new Utils();
        const parentA = new Flower();
        const parentB = new Flower();

        const oldChromosomeA = this.population[this.parentA].getChromosome();
        const oldChromosomeB = this.population[this.parentB].getChromosome();

        const from = utils.getRandomArbitrary(0, 5);
        const to = utils.getRandomArbitrary(from, 6);

        for (let n = 0; n < 10; n++) {
            const newChromosome = this.population[n].getChromosome();
            for (let a = from; a < to; a++) {
                if (utils.getRandomArbitrary(0, 2) === 0) {
                    newChromosome[a] = oldChromosomeA[a];
                } else {
                    newChromosome[a] = oldChromosomeB[a];
                }
                
                if (utils.getRandomArbitrary(0, 100) === 50) {
                    newChromosome[a] = this.getAlleleValue(a, utils);
                }
            }
            
        }
    }

    getAlleleValue(a, utils) {
        const values = {
            0: utils.getRandomArbitrary(10, 300),
            1: utils.getRandomArbitrary(0, 3),
            2: utils.getRandomArbitrary(0, 3),
            3: utils.getRandomArbitrary(5, 15),
            4: utils.getRandomArbitrary(20, 80),
            5: utils.getRandomArbitrary(5, 15),
        };

        return values[a];
    }

    getUserNeeds() {
        const height = document.querySelector('input[name="height"]:checked').value;
        const color = document.querySelector('input[name="color"]:checked').value;
        const size = document.querySelector('input[name="size"]:checked').value;

        console.log(height);
        console.log(color);
        console.log(size);

        return { height, color, size };
    }

}
