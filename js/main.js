var nothing;
document.addEventListener('DOMContentLoaded', () => {
    
    function createUser() {
        let email = document.getElementById('signupemail').value;
        let password = document.getElementById('signuppwd').value;
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then(() => {
   
          })
          .catch(error => {
            changeErrMessage(error.message);
          });
      }
    
      function signIn() {
        let email = document.getElementById('signinemail').value;
        let password = document.getElementById('signinpwd').value;
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then(() => {
           
          })
          .catch(error => {
            changeErrMessage(error.message);
            console.log("unknown")
          });
      }


    const errorMessage = document.getElementById('error-message');
    function changeErrMessage(message) {
        errorMessage.innerHTML = message;
    }

    const btnSignin = document.getElementById('signin');
    btnSignin.addEventListener('click', signIn)

    const inputPassword = document.getElementById('signinpwd');
    inputPassword.addEventListener('keyup', e => {
        if(e.code === 'Enter' || e.code === 'NumpadEnter') signIn();
    });

    const btnSignup = document.getElementById('signup');
    btnSignup.addEventListener('click', createUser)

    const upinputPassword = document.getElementById('signuppwd');
    upinputPassword.addEventListener('keyup', e => {
        if(e.code === 'Enter' || e.code === 'NumpadEnter') createUser();
    });

    firebase.auth().onAuthStateChanged(user => {

        if(user) {
            console.log("user", user)
    
          document.querySelector('.container').classList.add('none');
        
          changeErrMessage('');
    
          document.querySelector('#logged').classList.remove('none');
          
          console.log(user.email)
          const email = user.email;
          if (user.email ==="t109590044@ntut.org.tw"){
            console.log("123");
            document.querySelector('.admin').classList.remove('none');
          }else{
            console.log("33")
          }
         
        
          const uid = user.uid;
          const emailVerify = user.emailVerified;
          document.getElementById('user-email').innerHTML = `Account：${email}`;
          document.getElementById('user-uid').innerHTML = `Uid：${uid}`;
          document.getElementById('user-email-verify').innerHTML = `Verify-email：${emailVerify}`;       
    
          const btnVerifyEmail = document.getElementById('verify-email');
          btnVerifyEmail.addEventListener('click', () => {
            firebase.auth().languageCode = 'zh-TW'; 
            user.sendEmailVerification().then(() => {
                swal('Success!','Please check your email to verify the account!', 'success');
            }).catch(error => {
              changeErrMessage(error.message);
            });
          });
    
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
        else {
          console.log("QQ")
          const btnUserForgotSure = document.getElementById('findpwd');
          btnUserForgotSure.addEventListener('click', e => {
            const emailAddress = document.getElementById('forgetemail').value;
            const auth = firebase.auth();
            firebase.auth().languageCode = 'zh-TW'; // 發信模版改中文
            
            auth.sendPasswordResetEmail(emailAddress).then(() => {
              swal('Success!','Please check your email!', 'success');

              window.location.reload();
            }).catch(error => {
              changeErrMessage(error.message)
            });
          })
    
        }
    
      });



















})
