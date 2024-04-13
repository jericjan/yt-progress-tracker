const INTERVAL = 250;

async function waitforElem(selector: string): Promise<Element | YT.Player> {
  console.log("Checking for element:", selector);

  return new Promise((resolve) => {
    // const intervalId = setInterval(() => {
    //   const element = document.querySelector(selector);
    //   if (element) {
    //     clearInterval(intervalId);
    //     console.log("Element found:", element.outerHTML);
    //     resolve(element);
    //   } else {
    //     console.log("Element not found yet...");
    //   }
    // }, INTERVAL);
    const findElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        // console.log("Element found:", element.outerHTML);
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
    // const intervalId = setInterval(() => {
    //   const elem = document.querySelector(selector) as Element;
    //   if (propertyName in elem) {
    //     clearInterval(intervalId);
    //     console.log("Property found:", propertyName);
    //     resolve((elem as any)[propertyName]());
    //   } else {
    //     console.log(
    //       "Couldn't find property. here be keys: ",
    //       Object.keys(elem)
    //     );
    //   }
    // }, PROPERTY_INTERVAL);

    const findProperty = () => {
      const elem = document.querySelector(selector) as Element;
      if (propertyName in elem) {
        // console.log("Property found:", propertyName);
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
