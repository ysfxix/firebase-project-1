const auth = firebase.auth();
const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

const signInBtn = document.getElementById("btnSignIn");
const signOutBtn = document.getElementById("btnSignOut");
const usernameLabel = document.getElementById("usernameHeading");
const imgUser = document.getElementById("imgUser");
const todoList = document.getElementById("todoList");
const createTodoBtn = document.getElementById("btnCreateTodo");

let unsubscribe;

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user){        
        var resultTodo = "";
        // if user is signed in
        signInBtn.hidden = true;
        signOutBtn.hidden = false;
        usernameLabel.innerHTML = user.displayName;
        createTodoBtn.hidden = false;
        imgUser.src = user.photoURL;

        const todoDBRef = db.collection("todos");

        // get all results from the todo collection
        unsubscribe = todoDBRef
            .orderBy("createdAt", "desc")
            .onSnapshot((result) => {
                result.forEach((doc) => {
                    const data = doc.data();
                    // console.log(data.name);
                    resultTodo += `<li>${data.name}</li>`
                });

                todoList.innerHTML = resultTodo;
                resultTodo = "";
            });

            //add todo to the collection
            createTodoBtn.onclick = () => {
            console.log(faker.commerce.productName());

            const { serverTimestamp } = firebase.firestore.FieldValue;

            todoDBRef.add({
               uid: user.uid,
               name: faker.commerce.productName(),
               createdAt: serverTimestamp()
            })
        }
    } else{
        // if user is signed out
        signInBtn.hidden = false;
        signOutBtn.hidden = true;
        createTodoBtn.hidden = true;
        usernameLabel.innerHTML = "Guest";
        imgUser.src = "img/user-guest.png";
        todoList.innerHTML = ""

        createTodoBtn.onclick = () => {
            console.log("Login to add ToDo!");
        }

        // unsubscribe from the result snapshot
        unsubscribe && unsubscribe()
    }
});

