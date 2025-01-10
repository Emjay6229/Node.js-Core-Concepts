### Extensions
- [x] Material Theme
- [x] Material Icon Theme

### Tools
- [x] Wireshark - To inspect network packets on a socket
- [x] Postman (or any API testing tool)
- [x] A Browser
- [x] NVM or NVM-Windows
- [x] Node.js (LTS)
- [x] An IDE
- [x] A Terminal

# ABOUT NODEJS

Brendan Eich, who worked for Netscape, invented JavaScript in 1995. But it was a programming language that could only run on a browser - because only browsers had the JavaScript interpreter/compiler (i.e engine) within them.
Node.js is a "Runtime Environment" - The Runtime Environment of a programming language is a software that provides all the tools and resources necessary for executing code written in that programming language. Runtime Environments like Node.js are actually a collection of sofware libraries/modules interacting together to allow for the execution of software. Before Node.js, there was the Apache and Nginx web server - a software which can listen to incoming requests and serve static content from the disk storage - but they were not designed to process application logic or interact directly with databases. The web browser is also a Runtime Environment for client-side JavaScript - it allows JavaScript to interact with the markup elements (through the DOM API) and tweak the style. Plus, it translates markup into visual elements. Client-side development is mostly programming the browser using markup and scripting.   

### Important Software Components in Node.Js

- [x] V8 Engine - The JavaScript Virtual Machine.
- [x] Libuv
- [x] Event Loop
- [x] Modules, bindings and Node APIs

These components closely together is what constitutes the Node.js environment.

1) V8 is the JavaScript VM - A software program that compiles JavaScript code to bytecode/machine code for the CPU. Without a JavaScript VM, a computer can not understand JavaScript. The V8 VM compiles and executes JavaScript source code, handles memory allocation for objects, and garbage collects objects it no longer needs. The V8 engine contains a memory heap and call stack. It contains the JIT compiler and a host of other components for transforming JS into machine code. It is written in C++ and can be embedded into any C++ application.

2) Libuv - A C library that handles I/O tasks and non-JS native CPU-intensive tasks. Libuv provides the popular event loop and the worker pool that powers asynchronous non-blocking I/O operations in Node.js (I/O refers primarily to interactions with a machine's disk, peripherals and over a network). One thing to note is that while it is true that JavaScript is a single-threaded language, Libuv—the low-level Node.js library-can spin up a thread pool (multiple CPU threads) when executing instructions in the operating system. Now, you don’t have to worry about these threads when using Node.js. Libuv knows how to manage them effectively. You just have to make use of the provided Node.js APIs to write the instructions. Libuv exposes its functionality through APIs.
The event loop and worker pool are components of libuv. The worker pool in Node.js is essentially a thread pool. By default, it consists of 4 threads, but this number can be configured using the UV_THREADPOOL_SIZE environment variable (the absolute maximum is 1024). When the JS engine encounters an asynchronous I/O task, it transfers it to the Node API which uses Libuv to spin up thread pools. For CPU intensive non-asynchronous tasks, worker threads are a better solution. Worker_Threads essentially spawn a V8 VM instance for executing the JS code, but this is NOT the same as with the Cluster module. Worker threads will share the same Event Loop, and for instance the same thread-pool (libuv). Remember that the Event Loop is not within V8 engine, but rather within Libuv. Each browser has its own Event Loop + VM engine for executing JS code. e.g. Deno uses V8 + Tokio Event engine.

3) The Event-Loop: The event loop is what allows Node.js to perform non-blocking I/O operations — despite the fact that a single JavaScript thread is used by default — by offloading operations to the system kernel whenever possible.

Since most modern OS kernels are multi-threaded, they can handle multiple operations executing in the background. When one of these operations completes, the OS kernel tells Node.js so that the appropriate callback may be added to the poll queue to eventually be executed. We'll explain this in further detail later in this topic.
NB: Wrapping the cpu-intensive task in a promise doesn't help.

### I/O-intensive tasks (uses the event loop)
- [x] DNS: dns.lookup(), dns.lookupService().
- [x] File System: All file system APIs except fs.FSWatcher() and those that are explicitly synchronous use libuv's threadpool.

### CPU-intensive tasks (uses the thread pool)
- [x] Crypto: crypto.pbkdf2(), crypto.scrypt(), crypto.randomBytes(), crypto.randomFill(), crypto.generateKeyPair().
- [x] Zlib: All zlib APIs except those that are explicitly synchronous use libuv's threadpool.

In many Node.js applications, these APIs above are the only sources of tasks for the Worker Pool. Applications and modules that use a C++ add-on can submit other tasks to the Worker Pool.
Node.js is written mostly with C/C++. As a program that is supposed to run web servers, Node.js needs to constantly interact with a device's operating system.

### Non-blocking I/O 
By default, I/O operations are thread blocking. But Node.js' architecture is designed in such a way that it executes I/O operations without blocking the (main) thread (by leveraging the I/O library called libuv which uses worker threads to handle potential blocking I/O tasks thus making them non-blocking to the main-thread). But the same is not true for CPU-intensive operations as they are capable of blocking the main thread since Node.js uses only a single-thread.

Consider the following;

    console.log('A');
    
     setTimeout(() => {
       console.log('B');
    }, 3000);
    
    console.log('C');
    
    

When the JS engine tries to execute the above programs, it places the first statement in the call-stack which gets executed and prints A in the console and gets popped out of the stack. Now, it places the second statement in the call stack and when it tries to execute the statement, it finds out that setTimeout() doesn’t belong to JS so it pops out the function and hands it to the appropriate Web/Node API to get executed there. Since the call stack is now again empty, it places the third statement in the stack and executes it thus printing C in the console.

```
output
    A
    C
    B
```

Non-blocking tasks include;
- [x] Short synchronous operations
- [x] Asynchronous I/O operations

## THE EVENT-DRIVEN ARCHITECTURE

Node.js is said to have an event-driven architecture. This means Node.js is built around listening to events and reacting to them promptly when they happen. These events can be timer events, network events, and so on. Node.js responds to those events by using an event loop to load event callbacks to the engine after something triggers an event. It is for this reason that Node.js is excellent for real-time data transfer applications.
Node.js operates based on events. An event can be any kind of interaction, such as a request from a client, a completed I/O operation, or a timer expiring.
Node.js listens for these events and triggers the associated callback functions to handle them. The code you write often revolves around handling these events (e.g., when a client sends a request to your server).

## Events and Callbacks
By leveraging event-driven architecture and the use of callbacks as a mechanism to return control to the event Loop, Node.js is able to implement asynchronicity and handle real-time processing.

e.g

```
app.get('/async-task', function (req, res) {
    if (Object.keys(req.body).length === 0) {
        return "request body is empty';
    }
    return "request payload is = " + req.body;
})
```

A request to route ‘/async-task' is an event. This event will trigger the main thread (event loop) to pick it up and execute the callback function associated with the route. If the callback is synchronous (like this code example), the request is handled immediately, and the response is sent back to the client without blocking the event loop. Once the callback finishes, the main thread (event loop) is free to handle other incoming requests. If multiple requests come in almost simultaneously, Node.js will handle them concurrently. The event loop won't be stalled waiting for one request to finish before handling the next one. Each request is processed as soon as it arrives, as long as the previous request didn't involve any blocking operation.

### Don’t Block the Event Loop (aka the main thread)
Like most solutions, there are advantages and disadvantages, and Node.js is not an exclusion of this. Since we know Node.js runs using the event loop, aka as the main thread, blocking the loop will indeed prevent the system from running other instructions regardless of whether they belong to a single process or multiple different processes.
Didn’t you say the event loop “triggers intensive operations and move them aside, resuming a process once the operations get a response”?

Yes.

However, it is important to clarify the event loop’s ability to “resume” an I/O operation process doesn’t mean it will be capable of getting away around with an intensive CPU operation. The beauty of an I/O operation is to use external CPU processing power to execute a process instead of the V8. However, if our Node.js application is the one using intensive CPU processing power to execute a process, it means we cannot execute other sets of instructions until the heavy processing power instruction completes. This is called blocking the event loop.

# SOFTWARE PROJECTS
- [x] Build a Chat app on a TCP server
- [x] Build an e-learning platform
- [x] Build a search engine using apache lucene OR RAG
- [x] Build a recomendation system with Redis Database
- [x] Build an async I/O library
- [x] Build a simple web browser
- [x] Build a JavaScript compiler/interpreter that can live outside a runtime environment.
