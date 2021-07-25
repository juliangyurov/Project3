// Button Interface description:
//
// Class Elevator has methods for buttons: on shafts and inside elevators
//
// Method: shaftButton(button)
// Input: button = {position: from -1 up to 10, direction: "up" or "down"}
// If elevator A: button.position: range  (-1 to 9) 
// If elevator B: button.position: range   (0 to 10)
// 
// Method: elevatorButton(button)
// Input: button =  from -1  up to 10
// If elevator A: range  (-1 to 9 , "Emergency", "Restart")
// If elevator B: range  (0 to 10 , "Emergency", "Restart")
 

//Define number of elevator passengers
const numPassengers = 100;
//const numPassengers = 4;

// Max transfers for passenger from floor to floor
const maxTransfers = 1;

//Define number of elevator floors/positions
const numPositions = 12;  //-1,0,1-10

// Time ticks (1 tick = 1 sec)
const maxTimeTicks = 180;
let timeTicks = maxTimeTicks;
//const maxTimeTicks = 37;
//let timeTicks = maxTimeTicks;

// Maximal travel distance(time) from floor to floor
const maxTravelTime = numPositions - 1;
// Finding shortest travel
let minTravelTime = maxTravelTime;

// Testing
let elevatorADirection , elevatorBDirection;

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
            console.log(`Elevator ${this.name}: action:  Open doors`);
        }
     }
    closeDoors(){
        if(this.doorsOpened === true){
            this.doorsOpened = false;
            console.log(`Elevator ${this.name}: action:  Close doors`);
        }
    }
    moveUp(){
        if(this.position < this.maxFloor){
            this.closeDoors();
            this.direction = "up";
            this.position += 1;
            console.log(`Elevator ${this.name}: action: moving up to floor#${this.position}: OK`);
            // if(this.destinationFloor === this.position){
            //     this.openDoors();
            // }
        }
    }
    moveDown(){
        if(this.position > this.minFloor){
            this.closeDoors();
            this.direction = "down";
            this.position -= 1;
            console.log(`Elevator ${this.name}: action: moving down to floor#${this.position}: OK`);
            // if(this.destinationFloor === this.position){
            //     this.openDoors();
            // }
        }
    }
    // move(floor){
    //     var inFloor = floor; 
    //     if(floor === this.position){
    //         console.log(`Elevator-${this.name}: action: move to floor#${inFloor}: already there, time: 0 sec`);
    //         this.openDoors();
    //     }else if(floor < -1 || floor >10){
    //         console.log(`Elevator-${this.name} action: move to floor#${inFloor}: wrong floor number: ${inFloor}`);
    //     }else{
    //         this.closeDoors();
    //         console.log(`Elevator-${this.name}: action: move to floor#${inFloor}: OK, time: ${this.getTravelTime(this.position,floor)} sec`);
    //         this.position = floor;
    //         this.openDoors();
    //     }
    // }
    
    // Input: button = {position: from -1 up to 10, direction: "up" or "down"}
    // If elevator A: button.position: range  (-1 to 9) 
    // If elevator B: button.position: range   (0 to 10)
    shaftButton(button){
        let shButton = {position: null, direction: null};
        shButton.position = button.position;    // A: -1 to 9 , B: 0 to 10
        shButton.direction = button.direction;  // "up" or "down"
        this.shaftRequests.push(button);
    }
 
    // Input: button =  from -1  up to 10
    // If elevator A: range  (-1 to 9 )
    // If elevator B: range  (0 to 10 )
    elevatorButton(button){ // button:  A: -1 to 9 , B: 0 to 10 , "Emergency", "Restart"
        this.elevatorRequests.push(button);
    }   

    getMaxFloorRequest(){
        let maxFloorReq = this.minFloor;
        for(let i = 0 ; i < this.shaftRequests.length; i++){
            if(this.shaftRequests[i].position > maxFloorReq){
                maxFloorReq = this.shaftRequests[i].position;
            }
        }
        for(let i = 0 ; i < this.elevatorRequests.length; i++){
            if(this.elevatorRequests[i] > maxFloorReq){
                maxFloorReq = this.elevatorRequests[i];
            }
        }
        return maxFloorReq;
    }
    getMinFloorRequest(){
        let minFloorReq = this.maxFloor;
        for(let i = 0 ; i < this.shaftRequests.length; i++){
            if(this.shaftRequests[i].position < minFloorReq){
                minFloorReq = this.shaftRequests[i].position;
            }
        }
        for(let i = 0 ; i < this.elevatorRequests.length; i++){
            if(this.elevatorRequests[i] < minFloorReq){
                minFloorReq = this.elevatorRequests[i];
            }
        }
        return minFloorReq;
    }

    // Counts requests button and desides direction "Up" or "Down" 
    // If (1) direction === null and (2) there are some requests 
    // then direction sets to "up" or "down" till max(min)floor reached
    // If max(min)floor reached then change direction if there are some requests
    // Floor requests executed and then Elevator requests
    checkRequests(){
        let nextDirection = "no requests";
        let upCount = 0;
        let downCount = 0;
        let maxFlReq = this.getMaxFloorRequest();
        let minFlReq = this.getMinFloorRequest();

        // If there are requests elevator keeps moving same direction till max(min)floor reached
        if((this.shaftRequests.length > 0 || this.elevatorRequests.length > 0) && 
            (this.direction === "up" || this.direction === "down")){
                if(this.direction === "up" && this.position >= maxFlReq){
                    this.direction = "down";
                    return this.direction;
                }else if(this.direction === "down" && this.position <= minFlReq){
                    this.direction = "up";
                    return this.direction;
                }
                else{
                    return this.direction;
                }
        }

        // Elevator requests

        if(this.direction === null && this.elevatorRequests.length > 0){
            nextDirection = (this.position < this.elevatorRequests[0])?"up": ((this.position > this.elevatorRequests[0])?"down":"no requests");
            //console.log(`Elevator ${this.name} position: ${this.position} Elevator request: --> ${nextDirection}`);
            if(nextDirection === "up" || nextDirection === "down"){
                this.direction = nextDirection;
                return nextDirection;
            }else{
                this.direction = null;
                return nextDirection;
            }
        }

        // Shaft requests

        if(this.direction === null && this.shaftRequests.length > 0){
            // Count upCount downCount
            for(let i = 0;i < this.shaftRequests.length;i++){
                if(this.position < this.shaftRequests[i].position){
                    upCount++;
                }
                if(this.position > this.shaftRequests[i].position){
                    downCount++;
                }            
            }
    
            nextDirection = (upCount > downCount)?"up":"down";
            this.direction = nextDirection;
            //console.log(`Elevator ${this.name} position: ${this.position} upCount: ${upCount}, downCount: ${downCount} --> ${nextDirection}`);
            return nextDirection;
        }


    }

    // Update/delete old requests
    updateShaftRequests(){
        //console.log(`Elevaror ${this.name} updateShaftRequests: ${this.shaftRequests.length} before`);
        for(let i = 0;i < this.shaftRequests.length;i++){
            if(this.position === this.shaftRequests[i].position){
                this.shaftRequests.splice(i,1);
                //console.log(`Elevaror ${this.name} updateShaftRequests: ${this.shaftRequests.length} after`);
                break;
            }
        }
    }

    // Update/delete old requests
    updateElevatorRequests(){
        //console.log(`Elevaror ${this.name} updateElevatorRequests: ${this.elevatorRequests.length} before`);
        for(let i = 0;i < this.elevatorRequests.length;i++){
            if(this.position === this.elevatorRequests[i]){
                this.elevatorRequests.splice(i,1);
                //console.log(`Elevaror ${this.name} updateElevatorRequests: ${this.elevatorRequests.length} after`);
                break;
            }
        }
    }
}

class Passenger{
    constructor(name){
        this.name=name;
        this.elevator = (Math.random() > 0.5)?"A":"B";  // // starting elevator position - A or B

        if(this.elevator === "A"){
            this.position=Math.floor(Math.random() * (numPositions-1)) - 1; // A -> from -1 to 9
        }else{
            this.position=Math.floor(Math.random() * (numPositions-1)) ;    // B -> from 0 to 10
        }
         
        this.isInElevator = false;      // inside elevator or not
        this.numTransfers = 0;          // number of passenger transfers from floor to floor
        this.lastButton = null;
        this.history = [];  // 
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

    addHistory(time){
        let histElement = {position: this.position, elevator: this.elevator, 
            isInElevator: this.isInElevator, lastButton: this.lastButton, timeTick: time};
        this.history.push(histElement);    
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
console.log("Create all passengers");
const passenger = [];
for(let i=0;i<numPassengers;i++){
    passenger.push(new Passenger(`passenger${i}`));
    console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position}`);
}
console.log(".");

// console.log(elevatorA);
// console.log(elevatorB);
// console.log(passenger);

// Time ticks iterations
while(timeTicks>0){

// All passengers pressed one of butons
console.log(`All passengers pressed one of butons: time[sec]: ${maxTimeTicks-timeTicks}`);
for(let i=0;i<numPassengers;i++){
    if(passenger[i].lastButton === null && passenger[i].numTransfers < maxTransfers){   // permits only passenger[i] one time press before completion of request
        passenger[i].pressButton();
        //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} position ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
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

        passenger[i].addHistory(maxTimeTicks-timeTicks);
    }
}
console.log(".");

// console.log("elevator A: requests");
// console.log(elevatorA.shaftRequests);
// console.log(elevatorA.elevatorRequests);
// console.log("elevator B: requests");
// console.log(elevatorB.shaftRequests);
// console.log(elevatorB.elevatorRequests);

// Elevator dispatcher here

//  Check for waiting after "up" or "down" button passengers and elevators on the same floor and elevator is stopped or same direction

//elevatorA.noPassengers = true;
for(let i=0;i<numPassengers;i++){
    if(passenger[i].elevator === "A"){
        if(passenger[i].position === elevatorA.position && passenger[i].isInElevator === false &&
            passenger[i].numTransfers < maxTransfers){
            //console.log("---------------------------------------------elevator A-----------------------------------------------");
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
            elevatorA.openDoors();
            passenger[i].isInElevator = true;
            elevatorA.noPassengers = false;
            elevatorA.updateShaftRequests();    // delete same floor request
            passenger[i].lastButton = null;     // delete old request for elevator
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} `);
            passenger[i].addHistory(maxTimeTicks-timeTicks);
        }else if(passenger[i].isInElevator && passenger[i].lastButton === elevatorA.position){  // Check for arrival to destination floor
            //console.log("---------------------------------------------elevator A-----------------------------------------------");
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} arrived at floor ${passenger[i].lastButton}`);
            elevatorA.openDoors();
            passenger[i].isInElevator = false;
            passenger[i].numTransfers+=1;
            passenger[i].position = elevatorA.position;
            elevatorA.updateElevatorRequests();    // delete same floor request
            passenger[i].lastButton = null;     // delete old request from inside elevator
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} `);
            passenger[i].addHistory(maxTimeTicks-timeTicks);
        }
    }

}
elevatorA.closeDoors();

for(let i=0;i<numPassengers;i++){
    if( passenger[i].elevator === "B"){
        if(passenger[i].position === elevatorB.position && passenger[i].isInElevator === false &&
            passenger[i].numTransfers < maxTransfers){
            //console.log("--------------------------------------------elevator B-------------------------------------------------");
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} pushed button ${passenger[i].lastButton}`);
            elevatorB.openDoors();
            passenger[i].isInElevator = true;
            elevatorB.noPassengers = false;
            elevatorB.updateShaftRequests();    // delete same floor requests
            passenger[i].lastButton = null;     // delete old request for elevator
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position}`);
            passenger[i].addHistory(maxTimeTicks-timeTicks);
         }else if(passenger[i].isInElevator && passenger[i].lastButton === elevatorB.position){// Check for arrival to destination floor
            //console.log("--------------------------------------------elevator B------------------------------------------------");
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} arrived at floor ${passenger[i].lastButton}`);
            elevatorB.openDoors();
            passenger[i].isInElevator = false;
            passenger[i].numTransfers+=1;
            passenger[i].position = elevatorB.position;
            elevatorB.updateElevatorRequests();    // delete same floor requests
            passenger[i].lastButton = null;     // delete old request from inside elevator
            //console.log(`${passenger[i].name} ${passenger[i].isInElevator?"inside":"outside"} elevator ${passenger[i].elevator} on the floor ${passenger[i].position} `);
            passenger[i].addHistory(maxTimeTicks-timeTicks);
         }
    }

}
elevatorB.closeDoors();

// if(elevatorA.shaftRequests.length > 0){
//     console.log("elevator A: shaftRequests");
//     console.log(elevatorA.shaftRequests);
// }

// if(elevatorA.elevatorRequests.length > 0){
//     console.log("elevator A: elevatorRequests");
//     console.log(elevatorA.elevatorRequests);
// }

// if(elevatorB.shaftRequests.length > 0){
//     console.log("elevator B: shaftRequests");
//     console.log(elevatorB.shaftRequests);
// }

// if(elevatorB.elevatorRequests.length > 0){
//     console.log("elevator B: elevatorRequests");
//     console.log(elevatorB.elevatorRequests);
// }


elevatorADirection = elevatorA.checkRequests();
elevatorBDirection = elevatorB.checkRequests();

if(elevatorADirection === "up"){
    elevatorA.moveUp();
}else 
if(elevatorADirection === "down"){
    elevatorA.moveDown();
}else{
    elevatorA.direction = null;
}  

if(elevatorBDirection === "up"){
    elevatorB.moveUp();
}else
if(elevatorBDirection === "down"){
    elevatorB.moveDown();
}else{
    elevatorB.direction = null;
}    
console.log(".");

timeTicks--;
};  // End of while

// Passenger History
console.log("Passenger History");
for(let i = 0; i < numPassengers; i++){
    console.log(`${passenger[i].name}`);
    for(let p = 0; p < passenger[i].history.length; p++ ){
        console.log(passenger[i].history[p]);
    }
    console.log(".");
}


