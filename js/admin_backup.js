// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD79RIj4dIW9OJvuq4JN7gOMAyozeGAgTU",
    authDomain: "ntut-final-1bf58.firebaseapp.com",
    projectId: "ntut-final-1bf58",
    storageBucket: "ntut-final-1bf58.appspot.com",
    messagingSenderId: "908139157246",
    appId: "1:908139157246:web:dd0f4ea7f51d5c6f96b7af"
  };
// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");


const creatgalleryButton = document.querySelector("#createPostBtn");
//creatgalleryButton.addEventListener('click', addgallery);

db 
    .collection("galleryList")
    .get()
    .then(doclist => {
        doclist.forEach(element => {
            const user = element.data();
            console.log(user);
            const col = `               
                <div class="col-md-4 col-6">
                    <div class="card my-3">
                        <img class="card-img-top" src="${user.photoURL}}" alt="">
                        <div class="card-body">
                            <h4 class="card-title mb-0">${user.title}</h4>
                        </div>
                        <span><button type="button" class="btn btn-primary btn-sm">Like</button>
                        <i class="fas fa-heart" style="color:red"></i>
                        <span id="liketext">${user.like}</span>
                        <button type="button" class="btn btn-secondary btn-sm" style="float:right">Dislike</button></span>
                        
                    </div>
                </div>
                <div></div>
                `;
            $("#galleryPostList").append(col);
        });
    })

var photoURL ;
// Binding change event for createPostImage
$createPostImage.change(function (e) {
    // Get the file object when user choose any files
    const file = this.files[0];
    const fileName = file.name;
    // Setup folder path for firebase storage
    const storagePath = `galleryImages/${fileName}`;
    const ref = firebase.storage().ref(storagePath);
    // Upload file to firebase storage
    console.log(`Start Upload image to: ${storagePath}`);
    $createPostImageURL.text(`Start Upload image to: ${storagePath}`);
    ref.put(file)
        .then(snapshot => {
            // If file is uploaded successfully
            console.log(snapshot);
            // Get image URL
            ref.getDownloadURL()
                .then(imageURL => {
                    console.log("imageURL", imageURL);
                    $createPostImageURL.text(`Image URL: ${imageURL}`);
                    const col = `
                        <img class="card-img-top" src =" ${imageURL}" alt=""></img>
                    `;
                    $("#imagePreview").append(col)
                    photoURL = imageURL;
                    document.getElementById("createPostBtn").disabled = false
                })
                .catch(err => {
                    $createPostImageURL.text(`Error: ${err}`);
                    console.log(err)
                });
        })
        .catch(err => {
            $createPostImageURL.text(`Error: ${err}`);
            console.log(err)
        });
});



async function addgallery(event) {
    event.preventDefault();
        
    const title = document.getElementById("createPostTitle").value;
    await db.collection('galleyList').add({
        title,
        photoURL
    })
    console.log("test");
    window.location.reload(); 
}

firebase.auth().onAuthStateChanged(user => {

    // 登入中
    if(user) {
        console.log("user", user)
        const btnLogOut = document.getElementById('logout');
          btnLogOut.addEventListener('click', () => {
            firebase
              .auth()
              .signOut()
              .then(() => {
                window.location.reload();
              }).catch(error => {
                changeErrMessage(error.message)
              });
          })
     
    }
    // 未登入
    else {
        console.log("QQ")
        window.location.assign("./index.html");

    }

  });