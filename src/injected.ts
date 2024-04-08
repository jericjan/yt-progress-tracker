// This is the inject page script that will run stuff on YT.Player and send it to the content script

console.log("i'm stuff")

document.addEventListener('EventA', function (e) {
    console.log('EventA received', e);
});

document.dispatchEvent(new CustomEvent('EventB', { stuff: "Bstuff" } as any ));

export {};
