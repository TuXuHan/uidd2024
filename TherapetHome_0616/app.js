var firebaseConfig = {
    apiKey: "AIzaSyDleoVny5n3z397o74H7x6RC2ztv5SsMYQ",
    authDomain: "therapet-3638e.firebaseapp.com",
    projectId: "therapet-3638e",
    storageBucket: "therapet-3638e.appspot.com",
    messagingSenderId: "769912430007",
    appId: "1:769912430007:web:db90a044f4854e6e2c9c32",
    measurementId: "G-YMPCYZ8GBB",
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();
var user = null;
var selectedAnimal = null;    

firebase.auth().onAuthStateChanged(function (authUser) {
    if (authUser) {
        user = authUser;
        console.log("User authenticated:", user);

        var displayNameElement = document.getElementById("displayName");
        if (displayNameElement) {
            displayNameElement.innerText =
                "Welcome to THERAPET, " + user.displayName;
            displayNameElement.style.display = "block";
            displayNameElement.style.position = "absolute";
            displayNameElement.style.right = "8%";
            displayNameElement.style.top = "20%";
            displayNameElement.style.fontSize = "1.2em"
        } else {
            console.error("displayName element not found.");
        }

        var userID = user.uid;
        var userRef = db.collection('users').doc(userID);
        userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                const selectedAnimal = userData.selectedAnimal;
                // 是否有doc exist就一定有selected animal
                if (selectedAnimal) {
                    document.getElementById("loginbox").style.display = "none";
                    document.getElementById("homebox").style.display = "block";
                    console.log('selectedAnimal:', selectedAnimal);
                    var homePetImage = document.getElementById("homePetImage");
                    var chatPetImage = document.getElementById("chatPetImage");
                        homePetImage.src = "image/" + selectedAnimal.toLowerCase() + ".png";
                        chatPetImage.src = "image/" + selectedAnimal.toLowerCase() + ".png";
                } else {
        
                    document.getElementById("loginContainer").style.display = "none";
                    document.getElementById("choosePetPage").style.display = "block";
                    console.log('selectedAnimal is not set');
                }
                /*
                try {
                    const chatMessagesRef = userRef.collection('chatMessages');
                const chatMessagesSnapshot = await chatMessagesRef.orderBy('timestamp').get();

                let messages = [];

                chatMessagesSnapshot.forEach(doc => {
                    let data = doc.data();
                    insertSorted(messages, {
                        id: doc.id,
                        timestamp: data.timestamp,
                        reply_message: data.reply_message,
                        user_message: data.user_message
                    });
                });

                messages.forEach(message => {
                    dafault_message(message.user_message, message.reply_message, message.timestamp);
                });
    
                } catch (error) {
                    console.error('Error getting documents: ', error);
                }
                */
            } else {
                console.log('No such document!');
                    document.getElementById("loginContainer").style.display = "none";
                    document.getElementById("choosePetPage").style.display = "block";
            }
        }).catch((error) => {
            console.log('Error getting document:', error);
        });
        
    } else {
        user = null;
        console.log("User not authenticated.");
        document.getElementById("loginContainer").style.display = "block";
        document.getElementById("choosePetPage").style.display = "none";

        var displayNameElement = document.getElementById("displayName");
        if (displayNameElement) {
            displayNameElement.style.display = "none";
        }
    }
});

function toggleSignIn() {
    if (user) {
        firebase.auth().signOut();
    } else {
        var provider = new firebase.auth.GoogleAuthProvider();
        firebase
            .auth()
            .signInWithPopup(provider)
            .then(function (result) {
                user = result.user;
                console.log("Successfully signed in as " + user.displayName);
            })
            .catch(function (error) {
                console.error("Google sign-in failed:", error);
            });
    }
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(function () {
            console.log("Signed Out");
            user = null;
            console.log("User not authenticated.");
            document.getElementById("loginContainer").style.display = "block";
            document.getElementById("choosePetPage").style.display = "none";
            document.getElementById("petNamingPage").style.display = "none";
            // new
            document.getElementById("homebox").style.display = "none";
            document.getElementById("loginbox").style.display = "block";

            var displayNameElement = document.getElementById("displayName");
            if (displayNameElement) {
                displayNameElement.style.display = "none";
            }
        })
        .catch(function (error) {
            console.error("Sign Out Error", error);
        });
}

function selectAnimal(animal) {
    selectedAnimal = animal;
    document.querySelectorAll("#animalImages img").forEach((img) => {
        img.style.border = "none";
    });
    event.target.style.border = "2px solid blue";
}

function nextPage() {
    if (selectedAnimal) {
        document.getElementById("choosePetPage").style.display = "none";
        document.getElementById("petNamingPage").style.display = "block";
        document.getElementById("displayName").style.display = "none";
        var chosenPetImage = document.getElementById("chosenPetImage");
        if (chosenPetImage) {
            chosenPetImage.src =
                "image/" + selectedAnimal.toLowerCase() + ".png";
        }
        var homePetImage = document.getElementById("homePetImage");
        var chatPetImage = document.getElementById("chatPetImage");
        if (chosenPetImage) {
            homePetImage.src = "image/" + selectedAnimal.toLowerCase() + ".png";
            chatPetImage.src = "image/" + selectedAnimal.toLowerCase() + ".png";
        }
    } else {
        alert("Please select an animal before proceeding.");
    }
}

function savePetName() {
    var petName = document.getElementById("petName").value;
    if (!petName) {
        alert("Please enter a name for your pet.");
        return;
    }

    var userID = user.uid;
    var userRef = db.collection("users").doc(userID);

    userRef
        .set(
            {
                selectedAnimal: selectedAnimal,
                petName: petName,
            },
            { merge: true },
        )
        .then(function () {
            console.log("Pet name saved successfully.");
            alert("Pet name saved successfully!");
            //new
            document.getElementById("homebox").style.display = "block";
            document.getElementById("loginbox").style.display = "none";
        })
        .catch(function (error) {
            console.error("Error saving pet name:", error);
            alert("Failed to save pet name. Please try again.");
        });
}

function insertSorted(array, message) {
    let timestampDate = new Date(message.timestamp);
    if (array.length === 0) {
        array.push(message);
        return;
    }

    for (let i = array.length - 1; i >= 0; i--) {
        let currentDate = new Date(array[i].timestamp);
        if (timestampDate >= currentDate) {
            array.splice(i + 1, 0, message);
            return;
        }
    }

    array.splice(0, 0, message);
}

function dafault_message(user_content, reply_content, time) {
    let date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let formattedHours = hours < 10 ? "0" + hours : hours;
    let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;

    const message = document.createElement("li");
    message.classList.add("message", `user`);
    message.style.order = 1;
    message.innerHTML = `<p class="time"></p><p class="content"></p>`;
    message.querySelector(".content").textContent = user_content;
    message.querySelector(".time").textContent = formattedHours + ":" + formattedMinutes;
    chatbox.appendChild(message);

    const message_pet = document.createElement("li");
    message_pet.classList.add("message", `pet`);
    message_pet.style.order = 1;
    message_pet.innerHTML = `<p class="time"></p><p class="content"></p>`;
    message_pet.querySelector(".content").textContent = reply_content;
    message_pet.querySelector(".time").textContent = formattedHours + ":" + formattedMinutes;
    chatbox.appendChild(message_pet);
    last_response = message_pet;
    chat_box_footer.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
}