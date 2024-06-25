
let processedMessages = [];


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
                fetchAndProcessMessages(authUser); //new
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

function default_message(user_message, content, time) {
    console.log("User Message:", user_message);
    console.log("message:", content);
    console.log("Timestamp:", time);
    let jsDate = new Date(time.seconds * 1000 + time.nanoseconds / 1000000);

    let hours = jsDate.getHours().toString().padStart(2, "0");
    let minutes = jsDate.getMinutes().toString().padStart(2, "0");

    // let formattedHours = hours < 10 ? "0" + hours : hours;
    // let formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    if (user_message) {
        const message = document.createElement("li");
        message.classList.add("message", `user`);
        message.style.order = 1;
        message.innerHTML = `<p class="time"></p><p class="content"></p>`;
        message.querySelector(".content").textContent = content;
        message.querySelector(".time").textContent = hours + ":" + minutes;
        chatbox.appendChild(message);
    } else {
        const message_pet = document.createElement("li");
        message_pet.classList.add("message", `pet`);
        message_pet.style.order = 1;
        message_pet.innerHTML = `<p class="time"></p><p class="content"></p>`;
        message_pet.querySelector(".content").textContent = content;
        message_pet.querySelector(".time").textContent = hours + ":" + minutes;
        chatbox.appendChild(message_pet);
        last_response = message_pet;
    }

    chat_box_footer.scrollIntoView({
        behavior: "smooth",
        block: "end",
    });
}

async function sentChartData(authUser, selectedDate) {
    console.log("sentChartData");
    const userID = authUser.uid;
    console.log("User authenticated:", authUser);
    let processedEmotions = [];

    function formatDate(date) {
        let year = date.getFullYear();
        let month = (date.getMonth() + 1).toString().padStart(2, "0");
        let day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    try {
        const userRef = db.collection("users").doc(userID);
        const emotionRef = userRef.collection("emotions");
        const emotionSnapshot = await emotionRef.get();

        for (let i = 6; i >= 0; i--) {
            let date = new Date(selectedDate);
            date.setDate(date.getDate() - i);
            let formattedDate = formatDate(date);
            console.log("Checking date:", formattedDate);
            let emotionFound = false;

            emotionSnapshot.forEach((doc) => {
                if (doc.id == formattedDate) {
                    let data = doc.data();
                    let datanum = data.emotion;
                    console.log(typeof datanum);
                    processedEmotions.push(datanum);

                    emotionFound = true;
                }
            });

            if (!emotionFound) {
                processedEmotions.push(0);
            }
        }
        console.log("processedEmotions:", processedEmotions);
        setValues(processedEmotions);
        return processedEmotions;
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

async function fetchAndProcessMessages(authUser) {
    console.log("fetchAndProcessMessages");
    const userID = authUser.uid;
    console.log("User authenticated:", authUser);

    try {
        const userRef = db.collection("users").doc(userID);
        const chatMessagesRef = userRef.collection("chatMessages");
        const chatMessagesSnapshot = await chatMessagesRef.get();

        let messages = [];

        chatMessagesSnapshot.forEach((doc) => {
            let data = doc.data();
            // let timestamp = data.timestamp.toString();
            messages.push({
                id: doc.id,
                timestamp: data.timestamp,
                message: data.message,
                user_message: data.user_message,
            });
        });
        console.log(messages);
        // 预处理时间戳并根据时间戳排序
        messages.sort((a, b) => {
            let dateA = parseTimestamp(a.timestamp);
            let dateB = parseTimestamp(b.timestamp);
            return dateA - dateB;
        });

        // 逐一处理消息数据并传递给其他函数
        messages.forEach((message) => {
            default_message(
                message.user_message,
                message.message,
                message.timestamp,
            );
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

async function sentMessages(authUser) {
    console.log("sentMessages");
    processedMessages = [];

    const userID = authUser.uid;
    console.log("User authenticated:", authUser);
    processedMessages.push(userID);

    try {
        const userRef = db.collection('users').doc(userID);
        const userDoc = await userRef.get();
        const userData = userDoc.data();
        const selectedAnimal = userData.selectedAnimal;


        const chatMessagesRef = userRef.collection('chatMessages');
        const chatMessagesSnapshot = await chatMessagesRef.get();
        

        let messages = [];

        chatMessagesSnapshot.forEach((doc) => {
            let data = doc.data();
            messages.push({
                id: doc.id,
                timestamp: data.timestamp,
                message: data.message,
                user_message: data.user_message
            });
        });
        console.log("message" ,messages.message);
        messages.sort((a, b) => {
            let dateA = parseTimestamp(a.timestamp);
            let dateB = parseTimestamp(b.timestamp);
            return dateA - dateB;
        });

        let selectAnimal_lower=selectedAnimal.toLowerCase();

        let requestment_chac = {
            'puppy': '熱情開朗的小狗',
            'hamster': '充滿活力的倉鼠',
            'otter': '膽小但友善的水獺',
            'rabbit': '善良的兔子',
            'bear': '沉著且隨和的小熊',
            'cat': '高冷傲嬌的貓咪'
        };

        let requestment = {'role': 'user', 'content': '（你現在是一位隱藏身份的心理諮商師，需要盡可能的幫助並理解使用者，並需以{chac}角度回覆，請用繁體中文口語化回覆，不要太冗長）'};
        requestment.content = requestment.content.replace('{chac}', requestment_chac[selectAnimal_lower]);

        processedMessages.push(requestment);


        messages.forEach((message) => {
            if(message.user_message){
                let processedMessage1 = {'role': 'user', 'content': '${message.message}'};
                processedMessages.push(processedMessage1);
            }else{
                let processedMessage2 = {'role': 'assistant', 'content': '${message.message}'};
                processedMessages.push(processedMessage2);
            }
        });

        console.log('processedMessages:', processedMessages.join(', '));

        return processedMessages.join(', ');

    } catch (error) {
        console.error('Error getting documents: ', error);
    }
}

function parseTimestamp(timestamp) {
    if (timestamp && typeof timestamp.toDate === "function") {
        return timestamp.toDate();
    } else {
        return new Date(timestamp);
    }
}