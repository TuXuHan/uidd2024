function googleSignIn() {
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
        .then(function(result) {
            var user = result.user;
            console.log("Successfully signed in as " + user.displayName);

        })
        .catch(function(error) {
            console.error("Google sign-in failed:", error);
        });
}
