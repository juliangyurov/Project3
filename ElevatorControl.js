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
        this.moving = false;
        this.position = 0;  // floors -1,0,1,2,3,...,10
        this.startFloor = 0; // 
        this.destinationFloor = 0; 
        this.direction = null;  // "up", "down" or null
        this.noPassengers = true;   // there are no passengers in the elevator

        if(this.name === "A"){
            this.maxFloor = 9; // Elevator A: Goes to all floors except the penthouse (floor 10)
            this.minFloor = -1;
        }else{
            this.maxFloor = 10;
            this.minFloor = 0;  // Elevator B: Goes all the way up (including 10) but does not go to the basement (-1)
        }
        
        this.shaftRequests = [];
        this.elevatorRequests = [];
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
        if(this.position < this.maxFloor){
            this.closeDoors();
            this.position += 1;
            console.log(`Elevator-${this.name}: action: moving up to floor#${this.position}: OK`);
            if(this.destinationFloor === this.position){
                this.openDoors();
            }
         }
    }
    moveDown(){
        if(this.position > this.minFloor){
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
            console.log(`Elevator-${this.name} action: move to floor#${inFloor}: wrong floor number: ${inFloor}`);
        }else{
            this.closeDoors();
            console.log(`Elevator-${this.name}: action: move to floor#${inFloor}: OK, time: ${this.getTravelTime(this.position,floor)} sec`);
            this.position = floor;
            this.openDoors();
        }
    }
    
    shaftButton(button){
        let shButton = {position: null, direction: null};
        shButton.position = button.position;    // A: -1 - 9 , B: 0 - 10
        shButton.direction = button.direction;  // "up" or "down"
        this.shaftRequests.push(button);
    }
 
    elevatorButton(button){ // button:  A: -1 - 9 , B: 0 - 10 "Emergency", "Restart"
        this.elevatorRequests.push(button);
    }   

    // Counts requests button and desides direction "Up" or "Down" 
    checkRequests(){
        let nextDirection = "err";
        let upCount = 0;
        let downCount = 0;
        if(this.position === -1){
            nextDirection = "up";
            console.log(`Elevator ${this.name} position: ${this.position} --> ${nextDirection}`);
            return nextDirection;
        }
        if(this.position === 10){
            nextDirection = "down";
            console.log(`Elevator ${this.name} position: ${this.position} --> ${nextDirection}`);
            return nextDirection;
        }
        // elevator position is from 0 to 9
        for(let i = 0;i < this.shaftRequests.length;i++){
            if(this.position < this.shaftRequests[i].position){
                upCount++;
            }
            if(this.position > this.shaftRequests[i].position){
                downCount++;
            }            
        }
        for(let i = 0;i < this.elevatorRequests.length;i++){
            if(this.position < this.elevatorRequests[i]){
                upCount++;
            }
            if(this.position > this.elevatorRequests[i]){
                downCount++;
            }            
        }
        nextDirection = (upCount >= downCount)?"up":"down"
        console.log(`Elevator ${this.name} position: ${this.position} upCount: ${upCount}, downCount: ${downCount} --> ${nextDirection}`);
        return nextDirection;
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
                let newFloorB = Math.floor(Math.random() * (numPositions-1)); //B -> from 0 to 10
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

//Testing elevators
// elevatorA.shaftButton({position:-1,direction:"up"});
// elevatorA.elevatorButton(3);
// console.log(elevatorA.shaftRequests[0]);
// console.log(elevatorA.elevatorRequests[0]);

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
    if(passenger[i].isInElevator){
        if(passenger[i].elevator === "A"){
            elevatorA.elevatorButton(passenger[i].lastButton);
        }else{
            elevatorB.elevatorButton(passenger[i].lastButton);
        }
    }else{  // outside elevator 
        if(passenger[i].elevator === "A"){
            elevatorA.shaftButton({position:passenger[i].position,direction:passenger[i].lastButton});
        }else{
            elevatorB.shaftButton({position:passenger[i].position,direction:passenger[i].lastButton});
        }
    }
}

console.log("elevator A: requests");
console.log(elevatorA.shaftRequests);
console.log(elevatorA.elevatorRequests);
console.log("elevator B: requests");
console.log(elevatorB.shaftRequests);
console.log(elevatorB.elevatorRequests);

// Elevator dispatcher here

//  Check for passengers and elevators on the same floor and elevator is stopped or same direction

//elevatorA.noPassengers = true;
for(let i=0;i<numPassengers;i++){
    if(passenger[i].position === elevatorA.position && passenger[i].elevator === "A" && 
        (elevatorA.direction === passenger[i].lastButton ||  elevatorA.direction === null) ){
        console.log("");
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorA.openDoors();
        passenger[i].isInElevator = true;
        elevatorA.noPassengers = false;
        //passenger[i].pressButton();
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} `);
        elevatorA.closeDoors();
    }
}
//elevatorB.noPassengers = true;
for(let i=0;i<numPassengers;i++){
    if(passenger[i].position === elevatorB.position && passenger[i].elevator === "B" && 
        (elevatorB.direction === passenger[i].lastButton ||  elevatorB.direction === null) ){
        console.log("");
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
        elevatorB.openDoors();
        passenger[i].isInElevator = true;
        elevatorB.noPassengers = false;
        //passenger[i].pressButton();
        console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position}`);
        elevatorB.closeDoors();
    }
}

if(elevatorA.checkRequests() === "up"){
    elevatorA.moveUp();
}
if(elevatorA.checkRequests() === "down"){
    elevatorA.moveDown();
}  
if(elevatorB.checkRequests() === "up"){
    elevatorB.moveUp();
}
if(elevatorB.checkRequests() === "down"){
    elevatorB.moveDown();
}  

// // Check for "no passenger in elevator" status
// // Go to the nearest call request floor
// minTravelTime = maxTravelTime;
// if(elevatorA.noPassengers){
//     let nextDestinationA = elevatorA.position;
//     let travelTimeA = maxTravelTime;
//     for(let i=0;i<numPassengers;i++){
//         if(passenger[i].elevator === "A"){
//             travelTimeA = elevatorA.getTravelTime(elevatorA.position,passenger[i].position);
//             if(travelTimeA > 0 && travelTimeA < minTravelTime){
//                 minTravelTime = travelTimeA;
//                 nextDestinationA = passenger[i].position;
//             }
//         }
//     }
//     if(nextDestinationA !== elevatorA.position){
//         elevatorA.move(nextDestinationA);
//     }
// } 
// minTravelTime = maxTravelTime;
// if(elevatorB.noPassengers){
//     let nextDestinationB = elevatorB.position;
//     let travelTimeB = maxTravelTime;
//     for(let i=0;i<numPassengers;i++){
//         if(passenger[i].elevator === "B"){
//             travelTimeB = elevatorB.getTravelTime(elevatorB.position,passenger[i].position);
//             if(travelTimeB > 0 && travelTimeB < minTravelTime){
//                 minTravelTime = travelTimeB;
//                 nextDestinationB = passenger[i].position;
//             }
//         }
//     }
//     if(nextDestinationB !== elevatorB.position){
//         elevatorB.move(nextDestinationB);
//     }
// } 

// Now with passengers inside elevators 
// 


// do 
// {



//     timeTicks--;
// }
// while(timeTicks > 0);


