
/* 

Definir una clase que se llame TicketManager, 
la cuál tendrá un arreglo de eventos que iniciará vacíos. 

*/

class TicketManager{
    #gain
    #getTodayDate(){
        const date = new Date();
        const today = date.toDateString();
        return today;
    }
    constructor(){
        this.events = []
        this.#gain= 0.15 //ganancia del 15%
    }

    getEvents (){
        console.log(this.events)
        return this.events
    }

    addEvent({ name, place, price, capacity, date }){
        
        let id
        capacity = capacity ?? 50 // ?? Si es null o undefined le pone por defecto 50, sino deja el valor que trae

        date = date ?? this.#getTodayDate() // ?? Si es null o undefined le pone por defecto una nueva 
                                        //fecha no inicializada, sino deja el valor que trae

        // id autoincremental si no hay eventos, le asigna 1 al id sino 
        if (this.events.length === 0) {
            id = 1
        }
        else{
            let lastID = this.events[this.events.length - 1].id
            id = ++lastID;
        }
        
        price = price + this.#gain * price // Se le agrega la ganancia.
        
        let event = {id, name, place, price, capacity, date, participants:[] }
        console.log(event)
        this.events.push(event)

    }

    getEventById(idEvent){
        return this.events.find(event => event.id === idEvent)?? [] //Si no encuentra el evento, devuelve un array vacío.
    }
}

let ticket= new TicketManager()
ticket.getEvents()
ticket.addEvent({name: 'Kirosawa', place: 'Japan', price: 50, capacity: null, date: undefined })
ticket.addEvent({name: 'Byung', place: 'Korea', price: 25, capacity: 500, date: new Date('06/09/2023') })
ticket.addEvent({name: 'Lola', place: 'USA', price: 20, capacity: 300, date: new Date('04/08/2023') })

let evento2 = ticket.getEventById(2)

console.log(evento2)

let evento4 = ticket.getEventById(4)
console.log(evento4)