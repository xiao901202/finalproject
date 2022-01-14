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
const storageRef = firebase.storage().ref();


const $createPostForm = $("#createPostForm");
const $createPostTitle = $("#createPostTitle");
const $createPostDate = $("#createPostDate");
const $createPostContent = $("#createPostContent");
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");

const $likebtn = $("#likebtn");

var checklike = 1;
var checklike1 = 1;

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
                    const previewImgTag = `<img src="${imageURL}">`;
                    $imagePreview.append(previewImgTag);
                    $createPostBtn.attr('disabled', false);
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

$createPostBtn.on('click', async (event) => {
    event.preventDefault();
    
    const title = $createPostTitle.val();
    const date = $createPostDate.val();
    const content = $createPostContent.val();
    const url = $createPostImageURL.text().split(': ')[1];
    const like = 0;
    const images = db.collection('images').doc(title);

    console.log(url);

    await images.set({
        title,
        date,
        content,
        url,
        like
    });
    swal("YA!!","Success!", 'success')
    window.location.reload();

});




async function render() {
    const images = db.collection('images');
    const todoDocs = await images.get();
    todoDocs.forEach((ImageDoc) => {
        var { title, url, like, date,content } = ImageDoc.data();
        const imageCard = `
            <div class="card" style="width: 30rem; margin: 40px">
                <img class="card-img-top" src="${url}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                    <div><i class="fas fa-calendar-alt"></i>
                        ${date}
                    </div>
                    <div><br></div>
                    <div>
                        ${content}
                    </div>
                </div>
                <span><button type="button" class="btn btn-primary btn-sm" id="${ImageDoc.id}">Like</button>
                <i class="fas fa-heart" style="color:red"></i>
                <span id="${ImageDoc.id + "text"}">${like}</span>
                <button type="button" class="btn btn-secondary btn-sm" style="float:right" id="${ImageDoc.id+'1'}">Dislike</button></span>
                <button type="button" class="btn btn-danger btn-lg" id="${ImageDoc.id+'2'}">Delete</button>
            </div>
        `;
        $galleryPostList.append(imageCard);
        $(`#${ImageDoc.id}`).on('click',function(){
            if(checklike == 1){
                like++ ;
                db.collection('images').doc(this.id).update({
                    like,
                });
                var liketext  = document.getElementById(ImageDoc.id+"text");
                liketext.innerHTML = like;
                if(checklike == 0){
                    checklike1 == 1
                }
                checklike = 0;
            }else{
                swal('Error','Voted!', 'error');
            }
        });

        $(`#${ImageDoc.id+'1'}`).on('click',function(){
            if(checklike1 == 1){
                like-- ;
                var temp = this.id.substring(0,(this.id.length) -1);
                console.log(temp);
                db.collection('images').doc(temp).update({
                    like,
                });
                var liketext  = document.getElementById(ImageDoc.id+"text");
                liketext.innerHTML = like;
                if(checklike1 == 0){
                    checklike == 1
                }
                checklike1 = 0;
            }else{
                swal('Error','Voted!', 'error');
            }
        });

        $(`#${ImageDoc.id+'2'}`).on('click',function(){
            var temp = this.id.substring(0,(this.id.length) -1);
            console.log(temp);
            swal({
                title: "Are you sure?",
                text: "You will not be able to recover this post!",
                icon: "warning",
                buttons: [
                  'No, cancel it!',
                  'Yes, I am sure!'
                ],
                dangerMode: true,
              }).then(function(isConfirm) {
                if (isConfirm) {
                  swal({
                    title: 'Success!',
                    text: 'The post is successfully deleted!',
                    icon: 'success'
                  }).then(function() {
                    
                    console.log(temp);
                    var ref = db.collection('images').doc(temp);
                    ref.delete().then(() => {
                        console.log('delete data successful');
                        window.location.reload();
                    });
                    
                  });
                } else {
                  swal("Cancelled", "Your post file is safe :)", "error");
                }
              })
            

        });


    });
}

render();

firebase.auth().onAuthStateChanged(user => {

    // 登入中
    
    if(user) {
        checklike = 1;
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