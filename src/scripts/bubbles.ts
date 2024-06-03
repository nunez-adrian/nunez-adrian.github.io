const wrapper = document.querySelector('.wrapper') as unknown as ElementCSSInlineStyle;
const profileElement = document.querySelector('.profile');
const items: NodeListOf<HTMLElement> = document.querySelectorAll('.item-with-gradient');
const frameRate = 2;
const minScale = .3;
const maxScale = 1.1;
const scaleRange = maxScale - minScale;

let lastFrame: any;

const gradientsFrom = [
    "from-purple-300",
    "from-blue-300",
    "from-yellow-300",
    "from-pink-300",
    "from-green-300",
    "from-red-300",
    "from-purple-300",
    "from-indigo-300",
    "from-orange-300"
];

const gradientsTo = [
    "to-purple-200",
    "to-blue-200",
    "to-yellow-200",
    "to-pink-200",
    "to-green-200",
    "to-red-200",
    "to-purple-200",
    "to-indigo-200",
    "to-orange-200"
];

// Desplazar la página para que el elemento medio esté centrado
profileElement?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

// Asigna un gradiente aleatorio a cada elemento
items.forEach(item => {
    const randomPosition = Math.floor(Math.random() * gradientsFrom.length);
    item.classList.add('bg-gradient-to-b', gradientsFrom[randomPosition], gradientsTo[randomPosition]);
});

// Comprueba si la pantalla es tactil para saber si es un dispositivo móvil
function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}

// @bradeneast: this helper function stolen from a hero on stackoverflow
function dynamicSort(property: string) {
    let sortOrder = 1;
    
    if (property[0] === "-") {
        sortOrder = -1;
        property = property.slice(1);
    }
    
    return function (a: any, b: any) {
        let result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
        return result * sortOrder;
    }
}

// Cuando pasa el ratón (o el dedo en pantallas tactiles) por encima de un elemento, este se hace grande y los elementos adyacentes se hacen más pequeños
function animateChildren(parent: any, origin: any) {
    
    const children = Array.from(parent.children);
    const childrenWithDistances: any = [];
    
    children.map((child: any) => {
        const r = child.getBoundingClientRect();
        const childX = r.right - (r.width / 2);
        const childY = r.bottom - (r.height / 2);
        const distanceY = isTouchDevice() ? Math.max(origin.touches[0].clientY, childY) - Math.min(origin.touches[0].clientY, childY) : Math.max(origin.y, childY) - Math.min(origin.y, childY);
        const distanceX = isTouchDevice() ? Math.max(origin.touches[0].clientX, childX) - Math.min(origin.touches[0].clientX, childX) : Math.max(origin.x, childX) - Math.min(origin.x, childX);
        const hypot = Math.hypot(distanceX, distanceY);
        
        child.distance = Math.round(hypot);
        childrenWithDistances.push(child);
    });
    
    childrenWithDistances.sort(dynamicSort('distance')).reverse();
    
    childrenWithDistances.map((child: any, index: any) => {
        const relativeAmt = (index / children.length) * scaleRange;
        child.style.setProperty('--scale', minScale + relativeAmt);
    });
}

// Cambiamos el addEventListener dependiendo de si es un dispositivo táctil o no
if (isTouchDevice()) {
    document.body.style.transform = "scale(1.4)";
    document.addEventListener('touchmove', function (e) {
        requestAnimationFrame(function (thisFrame) {
            if (thisFrame - lastFrame > frameRate) {
                const screenCenter = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                }
                const moveX = e.touches[0].clientX - screenCenter.x;
                const moveY = e.touches[0].clientY - screenCenter.y;
                
                wrapper.style.setProperty('--x', moveX / 10 + '%');
                wrapper.style.setProperty('--y', moveY / 10 + '%');
                
                animateChildren(wrapper, e);
            }
            lastFrame = thisFrame;
        });
    });
} else {
    document.addEventListener('mousemove', function (e) {
        requestAnimationFrame(function (thisFrame) {
            if (thisFrame - lastFrame > frameRate) {
                const screenCenter = {
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2
                }
                const moveX = e.x - screenCenter.x;
                const moveY = e.y - screenCenter.y;
                
                wrapper.style.setProperty('--x', moveX / 10 + '%');
                wrapper.style.setProperty('--y', moveY / 10 + '%');
                
                animateChildren(wrapper, e);
            }
            lastFrame = thisFrame;
        });
    });
}

// Si se hace scroll, se recalculan los tamaños de los elementos
document.body.addEventListener('scroll', function () {
    const screenCenter = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    }
    animateChildren(wrapper, screenCenter);
});