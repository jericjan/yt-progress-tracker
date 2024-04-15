const INTERVAL = 250;

async function waitforElem(selector: string): Promise<Element | YT.Player> {
  console.log("Checking for element:", selector);

  return new Promise((resolve) => {
    const findElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        
        resolve(element);
      } else {
        console.log("Element not found yet...");
        setTimeout(findElement, INTERVAL);
      }
    };

    findElement();
  });
}

async function waitforProperty(
  selector: string,
  propertyName: string
): Promise<any> {
  return new Promise((resolve) => {

    const findProperty = () => {
      const elem = document.querySelector(selector) as Element;
      if (propertyName in elem) {
        resolve((elem as any)[propertyName]());
      } else {
        console.log(
          "Couldn't find property. here be keys: ",
          Object.keys(elem)
        );
        setTimeout(findProperty, INTERVAL);
      }
    };

    findProperty();
  });
}

export { waitforElem, waitforProperty };
