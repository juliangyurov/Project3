//Define number of elevator passengers
const numPassengers = 4;

//Define number of elevator floors/positions
const numPositions = 12;  //-1,0,1-10

// Time ticks (1 tick = 1 sec)
const timeTicks = 180;

// Maximal travel distance(time) from floor to floor
const maxTravelTime = numPositions - 1;
// Finding shortest travel
let minTravelTime = maxTravelTime;

class Elevator{
    constructor(name){
        this.name = name;   // should be A or B
        this.doorsOpened = false;
        this.mooving = false;
        this.position = 0;  // floors -1,0,1,2,3,...,10
        this.startFloor = 0; // 
        this.destinationFloor = 0;  
        this.noPassengers = true;   // there are no passengers in the elevator
        if(this.name === "A"){
            this.maxFloor = 9; // Elevator A: Goes to all floors except the penthouse (floor 10)
            this.minFloor = -1;
        }else{
            this.maxFloor = 10;
            this.minFloor = 0;  // Elevator B: Goes all the way up (including 10) but does not go to the basement (-1)
        }
    }

    //  Gets travel time between floors in seconds - 1 sec for each floor
    getTravelTime(fromFloor,toFloor){
        if(fromFloor === toFloor){
            return 0;
        }
        if(fromFloor === -1){
            return toFloor+1;
        }
        if(toFloor === -1){
            return fromFloor+1;
        }else{
            return Math.abs(fromFloor-toFloor);
        }
    }

    openDoors(){
        if(this.doorsOpened === false){
            this.doorsOpened = true;
            console.log(`Elevator-${this.name}: action:  Open doors`);
        }
     }
    closeDoors(){
        if(this.doorsOpened === true){
            this.doorsOpened = false;
            console.log(`Elevator-${this.name}: action:  Close doors`);
        }
    }
    moveUp(){
        if(this.position < maxFloor){
            this.closeDoors();
            this.position += 1;
            console.log(`Elevator-${this.name}: action: moving up to floor#${this.position}: OK`);
            if(this.destinationFloor === this.position){
                this.openDoors();
            }
         }
    }
    moveDown(){
        if(this.position > minFloor){
            this.closeDoors();
            this.position -= 1;
            console.log(`Elevator-${this.name}: action: moving down to floor#${this.position}: OK`);
            if(this.destinationFloor === this.position){
                this.openDoors();
            }
        }
    }
    move(floor){
        var inFloor = floor; 
        if(floor === this.position){
            console.log(`Elevator-${this.name}: action: move to floor#${inFloor}: already there, time: 0 sec`);
            this.openDoors();
        }else if(floor < -1 || floor >10){
            console.log(`Elevator-${this.name} action: move to floor#${inFloor}: wrong floor number`);
        }else{
            this.closeDoors();
            console.log(`Elevator-${this.name}: action: move to floor#${inFloor}: OK, time: ${this.getTravelTime(this.position,floor)} sec`);
            this.position = floor;
            this.openDoors();
        }
    }

    floorButton(){

    }
    elevatorButton(buttonName){
        if(buttonName === "Emergency"){

        }

    } 
}

class Passenger{
    constructor(name){
        this.name=name;
        this.position=Math.floor(Math.random() * numPositions) - 1; // starting floor/position
        this.elevator = (Math.random() > 0.5)?"A":"B";  // // starting elevator position - A or B
        this.isInElevator = false;   // inside elevator or not
        this.lastButton = null;
    }
    pressButton(){
        if(this.isInElevator === false){    // passenger is outside
            if(this.position === -1){
                this.lastButton = "up";
            }else
            if(this.position === 10){
                this.lastButton = "down";
            }else{
                this.lastButton = (Math.random() > 0.5)?"up":"down";
            }
        }else{    // passenger is inside
            if(this.elevator === "A"){  // passenger is inside A
                let newFloorA = Math.floor(Math.random() * (numPositions-1)) - 1; //A -> from -1 to 9
                while(this.position === newFloorA){      // avoid same position
                    newFloorA = Math.floor(Math.random() * (numPositions-1)) - 1;
                }
                this.lastButton = newFloorA; 
            }else{  // passenger is inside B
                let newFloorB = Math.floor(Math.random() * (numPositions-1)); //B -> from 0 to 1
                while(this.position === newFloorB){      // avoid same position
                    newFloorB = Math.floor(Math.random() * (numPositions-1));
                }
                this.lastButton = newFloorB; 
            }
        }
    }
}


// Testing
// Create all elevators
const elevatorA = new Elevator("A");
const elevatorB = new Elevator("B");

// Create all passengers
const passenger = [];
for(let i=0;i<numPassengers;i++){
    passenger.push(new Passenger(`passenger${i}`));
    console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position}`);
}

// console.log(elevatorA);
// console.log(elevatorB);
// console.log(passenger);

// All passengers pressed one of butons
for(let i=0;i<numPassengers;i++){
    passenger[i].pressButton();
    //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
}

// Check for passengers and elevators on the same floor
elevatorA.noPassengers = true;
for(let i=0;i<numPassengers;i++){
    if(passenger[i].position === elevatorA.position && passenger[i].elevator === "A"){
        console.log("");
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorA.openDoors();
        passenger[i].isInElevator = true;
        elevatorA.noPassengers = false;
        passenger[i].pressButton();
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorA.closeDoors();
    }
}
elevatorB.noPassengers = true;
for(let i=0;i<numPassengers;i++){
    if(passenger[i].position === elevatorB.position && passenger[i].elevator === "B"){
        console.log("");
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorB.openDoors();
        passenger[i].isInElevator = true;
        elevatorB.noPassengers = false;
        passenger[i].pressButton();
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorB.closeDoors();
    }
}

// Check for "no passenger in elevator" status
// Go to the nearest call request floor
minTravelTime = maxTravelTime;
if(elevatorA.noPassengers){
    let nextDestinationA = elevatorA.position;
    let travelTimeA = maxTravelTime;
    for(let i=0;i<numPassengers;i++){
        if(passenger[i].elevator === "A"){
            travelTimeA = elevatorA.getTravelTime(elevatorA.position,passenger[i].position);
            if(travelTimeA > 0 && travelTimeA < minTravelTime){
                minTravelTime = travelTimeA;
                nextDestinationA = passenger[i].position;
            }
        }
    }
    if(nextDestinationA !== elevatorA.position){
        elevatorA.move(nextDestinationA);
    }
} 
minTravelTime = maxTravelTime;
if(elevatorB.noPassengers){
    let nextDestinationB = elevatorB.position;
    let travelTimeB = maxTravelTime;
    for(let i=0;i<numPassengers;i++){
        if(passenger[i].elevator === "B"){
            travelTimeB = elevatorB.getTravelTime(elevatorB.position,passenger[i].position);
            if(travelTimeB > 0 && travelTimeB < minTravelTime){
                minTravelTime = travelTimeB;
                nextDestinationB = passenger[i].position;
            }
        }
    }
    if(nextDestinationB !== elevatorB.position){
        elevatorB.move(nextDestinationB);
    }
} 

// Now with passengers inside elevators 
// 


// do 
// {



//     timeTicks--;
// }
// while(timeTicks > 0);


