class Elevator{
    constructor(name){
        this.name = name;   // should be A or B
        this.doorsOpened = false;
        this.mooving = false;
        this.position = 0;  // floors -1,0,1,2,3,...,10
        this.startFloor = 0; // 
        this.destinationFloor = 0;  
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
            closeDoors();
            this.position += 1;
            console.log(`Elevator-${this.name}: action: moving up to floor#${this.position}: OK`);
            if(this.destinationFloor === this.position){
                openDoors();
            }
         }
    }
    moveDown(){
        if(this.position > minFloor){
            closeDoors();
            this.position -= 1;
            console.log(`Elevator-${this.name}: action: moving down to floor#${this.position}: OK`);
            if(this.destinationFloor === this.position){
                openDoors();
            }
        }
    }
    move(floor){
        if(floor === this.position){
            console.log(`Elevator-${this.name}: action: move to floor#${floor}: already there, time: 0 sec`);
            openDoors();
        }else if(floor < -1 || floor >10){
            console.log(`Elevator-${this.name} action: move to floor#${floor}: wrong floor number`);
        }else{
            closeDoors();
            console.log(`Elevator-${this.name}: action: move to floor#${floor}: OK, time: ${getTravelTime(this.position,floor)} sec`);
            this.position = floor;
            openDoors();
        }
    }
    floorButton(){

    }
    elevatorButton(buttonName){
        if(buttonName === "Emergency"){

        }

    } 
}