
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
        
        let id = 0
        capacity = capacity ?? 50 // ?? Si es null o undefined le pone por defecto 50, sino deja el valor que trae

        date = date ?? this.#getTodayDate() // ?? Si es null o undefined le pone por defecto una nueva 
                                        //fecha no inicializada, sino deja el valor que trae

        // id autoincremental, si no hay eventos le asigna 1 al id, sino le suma uno al último id creado

        id = this.getNewId();
        
        price = price + this.#gain * price // Se le agrega la ganancia.
        
        let event = {id, name, place, price, capacity, date, participants:[] }
        console.log(event)
        this.events.push(event)

    }
    
    getLastId(){
        if (this.events.length === 0) {
            return 0;
        }
        else{
            let lastID = this.events[this.events.length - 1].id
            return lastID;
        }
    }

    getNewId(){

        let lastId = this.getLastId();
        if (lastId === 0) {
            return 1;
        }
        else{
            
            return ++lastId;
        }

    }

    getEventById(idEvent){
        return this.events.find(event => event.id === idEvent)?? [] //Si no encuentra el evento, devuelve un array vacío.
    }

    addParticipant(idEvent, idUser){
        
        let event = this.getEventById(idEvent)
        
        // verifico que exista el evento
        if(event !== [] && event && event.participants) {
            // verifico la capacidad que no esté lleno
            if(event.participants.length < event.capacity){
                //verifico que no exista el participante, 
                //si el índice es igual a -1 (FindIndex devuelve eso cuándo no lo encuentra) 
                //quiere decir que no se encontró en el array de participantes
                //entonces lo agrego
                

                if (event.participants.findIndex(participant => participant === parseInt(idUser))===-1){
                    event.participants.push(idUser)
                    console.log(event.participants)
                    // encuentro el índice del evento
                    const index = this.events.findIndex(e => e.id === idEvent);
                    // actualizo el evento 
                    this.events[index] = event;
                } 
                else
                {
                    console.warn("El participante ya está en el evento")
                }

            }
            else{
                console.warn("El evento está lleno")
            }
        }
        else{
            console.error("No se encontró el evento")
        }
    }

    addNewEvent(idEvent, city, date){
        let event = this.getEventById(idEvent)
        // verifico que exista el evento
        if(event !== []) {
            event.place = city.trim();
            event.date = date;
            
            event.id = this.getNewId();
            console.log(event)
            console.log(`Nuevo id ${event.id}`)
            this.events.push(event);
            
        }
        else{
            console.error("No se encontró el evento")
        }
    }

    editEvent(idEvent, objEventProps){
        let event = this.getEventById(idEvent);
        
        {

        }
    }

    deleteEvent(idEvent) {
        const index = this.events.findIndex(event => event.id === parseInt(idEvent));
        
        //en el if pregunto si lo encontró, es decir si findIndex no devolvió -1
        if (index !== -1) {
            //borro el evento con splice
            this.events.splice(index, 1);
            console.log(`Evento con id ${idEvent} eliminado`);
        } else {
            console.error("No se encontró el evento");
        }
    }

    editEvent(idEvent, objEventProps){
        let event = this.getEventById(idEvent);
        
        // Verificar que el evento existe
        if(event !== []) {
            // Recorro las propiedades del objeto que se le pasa como parámetro
            //key es la propiedad y value el valor que va a tomar en el evento modificado
            Object.entries(objEventProps).forEach(([key, value]) => {
                event[key] = value;
            });
            console.log(`El evento modificado es: ${JSON.stringify(event)}`);
            
             // Actualizo el evento en el arreglo de eventos
            const index = this.events.findIndex((e) => e.id === idEvent);
            
            //saco el original
            this.events.splice(index, 1, event);
            //añado el modificado
            this.events.push(event);
            console.log(`El evento con ID ${idEvent} ha sido modificado`);
            }
            
        }
    
}

let ticket = new TicketManager()

ticket.addEvent({name: 'Cirque du soleil', place: 'France', price: 50, capacity: null, date: undefined })
ticket.addEvent({name: 'Fuerza Bruta', place: 'Argentina', price: 25, capacity: 500, date: new Date('06/09/2023') })
ticket.addEvent({name: 'Teatro ciego', place: 'República Checa', price: 20, capacity: 3, date: new Date('04/08/2023') })

ticket.addNewEvent(3, "Ciudad del Cabo", new Date().toDateString())

console.log(ticket.getEventById(4))

ticket.addParticipant(3,4)
ticket.addParticipant(3,4)
ticket.addParticipant(3,6)
ticket.addParticipant(3,5)
ticket.addParticipant(3,7)

ticket.deleteEvent(1)
ticket.deleteEvent(2)
ticket.deleteEvent(3)
ticket.deleteEvent(4)

ticket.getEvents()

ticket.editEvent(2,{name: 'Padel WPT', place: 'San Luis', price: 123, capacity: 500, date: new Date('08/07/2023') })
console.log(ticket.getEventById(2))

