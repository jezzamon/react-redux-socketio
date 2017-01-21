import Server from 'socket.io';

export default function startServer(store) {
  const io = new Server().attach(8091);
	
	//toJs is from immutable.js to change to regular Javascript array/object
	//NOTE: anytime an Action has been dispatched, once it's done, it will check subscribe and fire any callbacks 

//	What we'll do is subscribe a listener to the store that reads the current state, turns it into a plain JavaScript object, and emits it as a state event on the Socket.io server. The result will be that a JSON-serialized snapshot of the state is sent over all active Socket.io connections.
	
	//you are publishing the WHOLE state, which could be a lot of data..
//	would optmize this (send relavant subset) in most cases
		store.subscribe(
		() => io.emit('state', store.getState().toJS()) 
	);
	
	//listen for connection events from clients
	io.on('connection', (socket) => {
    socket.emit('state', store.getState().toJS());
		socket.on('action', store.dispatch.bind(store));
  });
}

