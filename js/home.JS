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
const $createPostImage = $("#createPostImage");
const $createPostImageURL = $("#createPostImageURL");
const $imagePreview = $("#imagePreview");
const $createPostBtn = $("#createPostBtn");
const $galleryPostList = $("#galleryPostList");

const $likebtn = $("#likebtn");

var check = 0;
var checklike = 1;
var checklike1 = 1;
var checkemail = 0;

// Binding change event for createPostImage
async function render() {
    const images = db.collection('images');
    const todoDocs = await images.get();
    todoDocs.forEach((ImageDoc) => {
        var { title, url, like ,date,content} = ImageDoc.data();
        const imageCard = `
        <div class="card" style="width: 30rem; margin: 40px">
        <img class="card-img-top" src="${url}" alt="Card image cap">
        <div class="card-body">
            <h5 class="card-title">${title}</h5>
            <div id='textar'><i class="fas fa-calendar-alt"></i>
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
            </div>
        `;
        $galleryPostList.append(imageCard);
        

        $(`#${ImageDoc.id}`).on('click',function(){
          if(check == 1 && checkemail == 1){
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
            }
            else{
                swal('Error','Voted!', 'error');
            }}
          else if(check == 1 && checkemail == 0){
            swal('Error','Please Verify your email first!', 'error');
          }
          else{
              wal('Error','Please login first!', 'error');
          }
        });

        $(`#${ImageDoc.id+'1'}`).on('click',function(){
            if(check == 1 && checkemail == 1){
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
              }}
            else if(check == 1 && checkemail == 0){
              swal('Error','Please Verify your email first!', 'error');
            }
            else{
              swal('Error','Please login first!', 'error');
            }
        });

        


    });
}

render();

firebase.auth().onAuthStateChanged(user => {

    // 登入中
    
    if(user) {
      document.querySelector('.login').classList.remove('none');
      document.querySelector('.unlogin').classList.add('none');
        checklike = 1;
        check = 1;
        if(user.emailVerified){
          checkemail = 1;
        }
        console.log("user", user)
        const btnLogOut = document.getElementById('logout');
          btnLogOut.addEventListener('click', () => {
            swal({
              title: "Are you sure?",
              text: "You will be logout!",
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
                  text: 'Log out success!',
                  icon: 'success'
                }).then(function() {
                  
                  firebase
                    .auth()
                    .signOut()
                    .then(() => {
        
                      window.location.reload();
                    }).catch(error => {
                      changeErrMessage(error.message)
                    });
                  
                });
              } else {
                swal("Cancelled", "That's OK :)", "error");
              }
            })
            
          })
     
    }
    // 未登入
    else {
        check = 0;
        checkemail = 0;
        console.log("QQ")
        const btnLogOut = document.getElementById('logout');
        btnLogOut.addEventListener('click', () => {

          swal('Error','Please login first!', 'error');
        })
    }

  });