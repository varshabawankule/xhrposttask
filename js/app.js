const cl = console.log;

const BASE_URL = `https://jsonplaceholder.typicode.com`;
const POST_URL = `${BASE_URL}/posts`;


const spinner = document.getElementById('spinner')
const formID = document.getElementById("formID");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const addbtn = document.getElementById("addbtn");
const updatebtn = document.getElementById("updatebtn");
const userIdControl = document.getElementById("userId");

function snackBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

function createCard(arr) {
  let result = "";

  arr.forEach((post) => {
    result += `
        <div class="col-md-4 mb-3" id=${post.id}>
                <div class="card h-100">
                <div class="card-header">
                 <h3>${post.title}</h3>
                </div>
            <div class="card-body">
    <p>${post.body} </p>
            </div>
    <div class="card-footer d-flex justify-content-between">
    <button onClick="onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
    <button onClick="onRemove(this)" class="btn btn-sm btn-outline-danger">Remove</button>

    </div>
    </div>

            </div>


        `;
  });

  const postContainer = document.getElementById("postContainer");
  postContainer.innerHTML = result;
}
let postArr = [];
function fetchPost() {
  spinner.classList.remove("d-none");
  let xhr = new XMLHttpRequest();

  xhr.open("GET", POST_URL, true);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      // cl(xhr.response)
      formID.reset();
      postArr = JSON.parse(xhr.response);
      createCard(postArr);
      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
      cl(`something went wrong while fetching data`);
    }
  };
}
fetchPost();

function onPostSubmit(eve) {
  eve.preventDefault();
  let postObj = {
    title: titleControl.value,
    body: bodyControl.value,
    userId: userIdControl.value,
  };
  //cl(postObj)
  spinner.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("POST", POST_URL);
  xhr.send(JSON.stringify(postObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = xhr.response;

      let col = document.createElement("div");
      col.className = "col-md-4 mb-3";
      col.id = res.id;
      col.innerHTML = `
         <div class="card h-100">
                <div class="card-header">
                 <h3>${postObj.title}</h3>
                </div>
            <div class="card-body">
    <p>${postObj.body} </p>
            </div>
    <div class="card-footer d-flex justify-content-between">
    <button onClick="onEdit(this)" class="btn btn-sm btn-outline-primary">Edit</button>
    <button onClick="onRemove(this)" class="btn btn-sm btn-outline-danger">Remove</button>

    </div>
    </div>
       `;
      postContainer.prepend(col);
      spinner.classList.add("d-none");
    } else {
      cl(`something went wrong`);
      spinner.classList.add("d-none");
    }
  };
}

function onEdit(ele) {
  //cl(ele)
  let EDIT_ID = ele.closest(".col-md-4").id;
  localStorage.setItem("EDIT_ID", EDIT_ID);
  cl(EDIT_ID);
  //  let EDIT_OBJ = postArr.find(post => post.id == EDIT_ID)
  //  cl(EDIT_OBJ)

  let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`;

  spinner.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", EDIT_URL);
  xhr.send(null);

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let editObj = JSON.parse(xhr.response);

      titleControl.value = editObj.title;
      bodyControl.value = editObj.body;
      userIdControl.value = editObj.userId;

       window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

      


      updatebtn.classList.remove("d-none");
      addbtn.classList.add("d-none");
      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
    }
  };
}


function onUpdate() {
  let UPDATE_ID = localStorage.getItem("EDIT_ID");
  localStorage.removeItem("EDIT_ID");

  let UPDATED_OBJ = {
    title: titleControl.value,
    body: bodyControl.value,
    userId: userIdControl.value,
    id: UPDATE_ID,
  };
  cl(UPDATED_OBJ);

  let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`;

  spinner.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", UPDATE_URL);

  xhr.send(JSON.stringify(UPDATED_OBJ));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let res = JSON.parse(xhr.response);
      cl(res);
     

      let col = document.getElementById(UPDATE_ID)
      let h3 = col.querySelector(".card-header h3")
      let p = col.querySelector(".card-body p");

      h3.innerText = UPDATED_OBJ.title,
      p.innerText = UPDATED_OBJ.body


      col.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });



col.classList.add("border", "border-success", "border-3");

setTimeout(() => {
  col.classList.remove("border", "border-success", "border-3");
}, 2000);






      updatebtn.classList.add("d-none");
      addbtn.classList.remove("d-none");

      formID.reset()

      spinner.classList.add("d-none");
    } else {
      spinner.classList.add("d-none");
    }
  };
}

function onRemove(ele) {
  Swal.fire({
    title: "Are you sure u want to remove this post",

    showCancelButton: true,
    confirmButtonText: "Remove",
  }).then((result) => {
    cl(result);
    if (result.isConfirmed) {
      let REMOVE_ID = ele.closest(".col-md-4").id;
      //cl(REMOVE_ID)
      let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`;

      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", REMOVE_URL, true);
      xhr.send();
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          //obj is removed from DB
          ele.closest(".col-md-4").remove();
          snackBar(
            `The post with id ${REMOVE_ID} is removed successfully`,
            `success`,
          );
        } else {
          snackBar(`Something went wrong`, `error`);
        }
      };
    }
  });
}

formID.addEventListener("submit", onPostSubmit);
updatebtn.addEventListener("click", onUpdate);
