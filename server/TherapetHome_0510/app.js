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
