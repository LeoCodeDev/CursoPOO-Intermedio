const juan = {
  name: "Juan",
  age: 18,
  approveCourse: ["Curso 1"],
  addCourse(newCourse) {
    this.approveCourse.push(newCourse);
  },
};

Object.defineProperty(juan, "navigator", {
  value: "crhome",
  writable: true,
  enumerable: false,
  configurable: true,
});
Object.defineProperty(juan, "editor", {
  value: "VSCode",
  writable: false,
  enumerable: true,
  configurable: true,
});
Object.defineProperty(juan, "terminal", {
  value: "WSL",
  writable: true,
  enumerable: true,
  configurable: false,
});
Object.defineProperty(juan, "pruebaNasa", {
  value: "extraterrestre",
  writable: false,
  enumerable: false,
  configurable: false,
});

// Problemas de Copias de Objetos y referencia en memoria.

const obj1 = {
  a: "a",
  b: "b",
  c: 10,
  d: {
    e: "f",
    g: 20,
  },
  h: function ejemplo() {},
};

const obj2 = obj1; // <-- aqui si modificamos el objeto 1 o el objeto 2, tanto el obj1 como el obj2, se van a modificar, ya que comparten el mismo pointer a la memoria HEAP.

// para evitar esto se realiza de la siguiente manera un Shallow Copy

const obj3 = {};

for (prop in obj1) {
  obj3[prop] = obj1[prop]; // <-- de esta manera el obj3 no copia al obj1, esta extrayendo los valores de las propiedades y copiandolas "manualmente" dentro sus propias propiedades, sin compartir pointer, pero si una de las propiedades es un objeto, al copiarse de esta menra, estas propiedades estaran compartiendo pointer nuevamente. este problema tambien sucede con el metodo assign de Object.
}

//Recursividad

let nums = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
let num = 0;

for (let i = 0; i < nums.length; i++) {
  num = nums[i];
}

let nums2 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

function recursiva(param) {
  if (param.length !== 0) {
    const firstNum = param[0];
    param.shift();
    recursiva(param);
  }
}

recursiva(nums2);

// Deep Copy con Recursividad

function isObject(subject) {
  return typeof subject === "object";
}

function isArray(subject) {
  return Array.isArray(subject);
}

function deepCopy(subject) {
  let copySubject;

  if (isArray(subject)) {
    copySubject = [];
  } else if (isObject(subject)) {
    copySubject = {};
  } else {
    return subject;
  }

  for (key in subject) {
    if (isObject(subject[key])) {
      copySubject[key] = deepCopy(subject[key]);
    } else {
      if (isArray(subject)) {
        copySubject.push(subject[key]);
      } else {
        copySubject[key] = subject[key];
      }
    }
  }
  return copySubject;
}

const obj4 = deepCopy(obj1);

const studentBase = {
  name: undefined,
  email: undefined,
  age: undefined,
  approvedCourses: undefined,
  learningPaths: undefined,
  socialMedia: {
    twitter: undefined,
    instagram: undefined,
    facebook: undefined,
  },
};

const leopoldo = deepCopy(studentBase);
Object.defineProperty(leopoldo, "name", {
  value: "Juan",
  configurable: false,
  writable: false,
});

//Factory Pattern y RORO

function requireParam(param) {
  throw new Error(`${param} es obligatorio`);
}

function crearStudent({
  name = requireParam("name"),
  email = requireParam("email"),
  age,
  approveCourse = [],
  learningPaths = [],
  twitter,
  instagram,
  facebook,
} = {}) {
  const private = {
    _name: name,
    _learningPaths: learningPaths,
  };

  const public = {
    email,
    age,
    approveCourse,
    socialMedia: {
      twitter,
      instagram,
      facebook,
    },

    // readName(){
    //     return private["_name"];
    // },

    // changeName(newName){
    //     private["_name"] = newName
    // },

    get name() {
      return private["_name"];
    },

    set name(newName) {
      if (typeof newName === "string" && newName.length !== 0) {
        private["_name"] = newName;
      } else {
        console.warn(
          `Tu nombre debe contener al menos 1 caracter y ser de tipo texto`
        );
      }
    },

    get learningPaths() {
      return private["_learningPaths"];
    },

    set learningPaths(newLearningPaths) {
      if (!newLearningPaths.name) {
        console.warn(`${newLearningPaths} no es un Learning Path`);
        return;
      }
      if (!newLearningPaths.courses) {
        console.warn(`${newLearningPaths.name} no tiene courses`);
        return;
      }
      if (!isArray(newLearningPaths.courses)) {
        console.warn(`${newLearningPaths.name} no es una lista`);
        return;
      }
      private["_learningPaths"].push(newLearningPaths);
    },
  };

  // Object.defineProperties(public,{
  //     readName: {
  //         configurable: false,
  //         writable: false,
  //     },
  //     changeName: {
  //         configurable: false,
  //         writable: false,
  //     },
  // })

  return public;
}

function createLearningPath({ 
    name = requireParam("name"), 
    courses = [] 
}) {
  const private = {
    _name: name,
    _courses: courses,
  };

  const public = {
    get name() {
      return private["_name"];
    },

    set name(newName) {
      if (typeof newName === "string" && newName.length !== 0) {
        private["_name"] = newName;
      } else {
        console.warn(
          `Tu nombre debe contener al menos 1 caracter y ser de tipo texto`
        );
      }
    },

    get courses() {
      return private["_courses"];
    },
  };

  return public;
}

function createCourses({
  name = requireParam("name"),
  teacher = requireParam("teacher"),
  classes = [],
}) {
  const private = {
    _name: name,
    _teacher: teacher,
    _classes: classes,
  };
}

const samantha = crearStudent({
  name: "Samantha",
  email: "SamanthaMatinez@gmail.com",
  age: 7,
  twitter: "@sammy2312",
  instagram: "2312Samntha",
});

//Instance Of

function LearningPaths({
    name = requireParam("name"), 
    courses = [],
}) {
    this.name = name
    this.courses = courses
}

function creatStudent2({
  name = requireParam("name"),
  email = requireParam("email"),
  age,
  approveCourse = [],
  learningPaths = [],
  twitter,
  instagram,
  facebook,
}) {
    (this.name = name),
    (this.email = email),
    (this.age = age),
    (this.approveCourse = approveCourse),
    (this.socialMedia = {
        twitter,
        instagram,
        facebook,
    });

    const private = {
        '_learningPaths': []
    }

    Object.defineProperty(this, 'learningPaths',{
        get(){
            return private['_learningPaths']
        },

        set(newLP){
            if(newLP instanceof LearningPaths){
                private['_learningPaths'].push(newLP)
            }else{
                console.warn(`${newLP.name} No es una instancia de LearningPath`)
            }
        }
    })

    for (let paths of learningPaths) {
      this.learningPaths = paths
    }
  
}

const basicTraining = new LearningPaths({name: 'Basic training for puppies', courses: ['How to behave', 'Stand', 'Sit']})
const plaiying = new LearningPaths({name: 'Playing for Puppies', courses: ['bring the ball', 'catch the freezbie', 'pull the rope']})

const nyx = new creatStudent2({
  name: "Nyx",
  email: "nyx@dogshow.com",
  age: "2",
  learningPaths: [basicTraining,plaiying,{name: 'Curso para Gatos', courses:['how to annoying puppies']}]
});

class SuperObject{
    static deepCopy(subject) {
        let copySubject;
      
        if (isArray(subject)) {
          copySubject = [];
        } else if (isObject(subject)) {
          copySubject = {};
        } else {
          return subject;
        }
      
        for (key in subject) {
          if (isObject(subject[key])) {
            copySubject[key] = deepCopy(subject[key]);
          } else {
            if (isArray(subject)) {
              copySubject.push(subject[key]);
            } else {
              copySubject[key] = subject[key];
            }
          }
        }
        return copySubject;
      }

    static isObject(subject) {
        return typeof subject === "object";
      }
}

function HyperObject() {}

HyperObject.deepCopy = function (subject) {
    let copySubject;
  
    if (isArray(subject)) {
      copySubject = [];
    } else if (isObject(subject)) {
      copySubject = {};
    } else {
      return subject;
    }
  
    for (key in subject) {
      if (isObject(subject[key])) {
        copySubject[key] = deepCopy(subject[key]);
      } else {
        if (isArray(subject)) {
          copySubject.push(subject[key]);
        } else {
          copySubject[key] = subject[key];
        }
      }
    }
    return copySubject;
  }

  HyperObject.isObject = function (subject) {
    if(!Array.isArray(subject)){
        return typeof subject === "object";
    }
    return false
  }