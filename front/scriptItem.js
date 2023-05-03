//require("dotenv").config();
// const backendIPAddress = "3.90.97.139:3000";
const backendIPAddress = "127.0.0.1:3000";

let itemData;
var userTasks;
var userTaskFromDB;
var userTaskFromCV;
var foundUserTaskFromDB;
var id;

// clear tasks
function deleteAllBadges() {
    var badgeElements = document.querySelectorAll(".badge");
    badgeElements.forEach(function (badgeElement) {
        badgeElement.remove();
    });
}

// # 1.GET
const authorizeApplication = () => {
    window.location.href = `http://${backendIPAddress}/courseville/auth_app`;
};

//# 1.1 get all data save in a specific student_id
const getItemsFromDB = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = id; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};

//#1.2 display only "tasks list" of a specific student
const getStudentTasks = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = "6430204221"; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}/tasks`, options)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            itemData = data;
        })
        .catch((error) => console.error(error));
};

//#1.3 display only "subjects list" of a specific student
const getStudentSubjects = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    let studentId = "6430204221"; //should change this student_id for different output
    await fetch(`http://${backendIPAddress}/items/${studentId}/subjects`, options)
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};


//show data from calendar
const showItemsInTable = async () => {
    await getStudentTasks();

    const table = document.getElementById("myTable"); //fill main table body
    //table.innerHTML = "";
    const days = table.getElementsByClassName("day");
    if (itemData) {
        // Perform operations with the data
        // console.log(itemData, '----');
        // ... Rest of the code
    }

    const tasks = itemData;
    console.log(tasks, tasks.length)

    //เขียนโค้ดฝั่ง front แสดงข้อมูล assignment ลง calendar ได้เลย (อาจใช้แค่ task name กับ duedate)

    for (let i = 0; i < tasks.length; i++) {
        var duedate = tasks[i].duedate['S'];
        var task_name = tasks[i].task_name['S'];
        var deadline = tasks[i].deadline['S'];
        for (let j = 0; j < days.length; j++) {
            //const dayNumber = parseInt(days[j].getElementsByClassName("number")[0].innerHTML);

            const dayNumber = days[j].getElementsByClassName("number")[0].textContent;
            console.log(duedate)
            if (dayNumber === duedate.slice(-2)) {
                //??
                // create a new badge element with the task information
                const badge = document.createElement("div");
                badge.classList.add("badge");
                badge.onclick = function () {
                    badge_open();
                };
                badge.innerHTML = `
                        <span class="badge-name">${task_name}</span>
                        <span class="badge-time">${deadline}</span>`;
                days[j].appendChild(badge);
                break;
            }
        }
    }
};


//------------------------------------------------------------------
//# 2. POST

//# 2.1  add task to a specific student's tasks list
const addTask = async () => {
    const studentId = id;
    const task_name = document.getElementById("event-name-input").value;
    const description = document.getElementsByClassName(
        "event-description-input"
    )[0].value;
    const subject_id =
        document.getElementsByClassName("event-course-input")[0].value;
    const duedate = "2023-05-" + document.getElementById("date1").value;
    const deadline =
        document.getElementById("hour1").value +
        ":" +
        document.getElementById("min1").value;

    const status = "todo";
    console.log(deadline, "5555");

    console.log(document.getElementsByClassName(
        "event-description-input"
    ), description);
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            student_id: studentId,
            task_name: task_name,
            description: description,
            subject_id: subject_id,
            duedate: duedate,
            deadline: deadline,
            status: status,
        }),
        credentials: "include",
    };
    const data = await fetch(
        `http://${backendIPAddress}/items/${studentId}/tasks`,
        options
    ).catch((error) => console.error(error));
    console.log("jjjjjjj");
    console.log(data);

    deleteAllBadges();
    showItemsInTable();

};

// # 2.2 add subjects
const addSubject = async (studentId, subject) => {
    try {
        const response = await fetch(
            `http://${backendIPAddress}/items/${studentId}/subjects`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(subject),
            }
        );

        if (!response.ok) {
            throw new Error("Error adding subject");
        }

        const data = await response.json();
        console.log(data.message); // Assuming the response contains a 'message' property

        // Perform any additional actions upon successful subject addition
    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
};

// Example usage (if you want to test uncomment the code below)

// const studentId = "6430204221";
// const subject = {
//     subject_id: "0003",
//     subject_name: "math",
//     subject_color: "#FFD700",
// };

// addSubject(studentId, subject);
//

// # 3 PUT update a task's status
const updateTaskStatus = async (studentId, taskName, newStatus) => {
    try {
        const response = await fetch(
            `http://${backendIPAddress}/items/${studentId}/tasks`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ task_name: taskName, status: newStatus }),
            }
        );

        if (!response.ok) {
            throw new Error("Error updating task status");
        }

        const data = await response.json();
        console.log(data.message); // Assuming the response contains a 'message' property

        // Perform any additional actions upon successful task status update
    } catch (error) {
        console.error(error);
        // Handle error scenario
    }
};

// Example usage
// const studentId = "6430204221";
// const taskName = "backend coding";
// const newStatus = "completed";

// updateTaskStatus(studentId, taskName, newStatus);

//-------------------------------------------------------------------
// # 4. DELETE

const deleteItem = async (item) => {
    const options = {
        method: "DELETE",
        credentials: "include",
    };
    let student_id = "6430204221";
    let task_name = "history_reading";
    await fetch(
        `http://${backendIPAddress}/items/${student_id}/tasks/${task_name}`,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            itemData = data;
        })
        .catch((error) => console.error(error));
};

// await getItemsFromDB();
// showItemsInTable(itemData);
// deleteItem();

const getUserProfile = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(
        `http://${backendIPAddress}/courseville/get_profile_info`,
        options
    )
        .then((response) => response.json())
        .then((data) => {
            user = data.data.student;
            console.log(user);
            id = `${user.id}`;
        })
        .catch((error) => console.error(error));
};

const onLoad = async () => {
    await getUserProfile();
    console.log(user);
    document.getElementById(
        "username"
    ).innerHTML = `${user.firstname_en} ${user.lastname_en}`;
    document.getElementById("id").innerHTML = `${user.id}`;
};

onLoad();
showItemsInTable();

const logout = async () => {
    window.location.href = `http://${backendIPAddress}/courseville/logout`;
};

function calendar_open() {
    document.getElementById("body2").style.display = "block";
}

function event_open() {
    document.getElementById("event-all").style.display = "block";
}

function event_close() {
    console.log("close event");
    document.getElementById("event-all").style.display = "none";
}

function badge_open() {
    document.getElementById("badge-all").style.display = "block";
}

function badge_close() {
    document.getElementById("badge-all").style.display = "none";
}

const getUserTaskFromCV = async () => {
    var coursesThisYear = [];
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/courseville/get_courses`, options)
        .then((response) => response.json())
        .then((data) => data.data.student)
        .then((courses) => {
            console.log(courses);
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].year == "2022" && courses[i].semester == 2) {
                    coursesThisYear.push(courses[i]);
                }
            }
        })
        .catch((error) => console.error(error));
    console.log(coursesThisYear);
    var assignments = [];
    for (let i = 0; i < coursesThisYear.length; i++) {
        await fetch(
            `http://${backendIPAddress}/courseville/get_course_assignments/${coursesThisYear[i].cv_cid}`,
            options
        )
            .then((response) => response.json())
            .then((data) => data.data)
            .catch((error) => console.error(error));
    }
    userTaskFromCV = assignments;
};

const getUserTaskFromDB = async () => {
    const options = {
        method: "GET",
        credentials: "include",
    };
    await fetch(`http://${backendIPAddress}/items/data`, options)
        .then((response) => response.json())
        .then((data) => {
            for (var i = 0; i < data.length; i++) {
                if (data[i].id == user.id) {
                    userTaskFromDB = data[i].task;
                    foundUserTaskFromDB = true;
                    break;
                }
            }
        })
        .catch((error) => console.error(error));
};

const getUserTask = async () => {
    foundUserTaskFromDB = false;
    await getUserTaskFromDB();
    if (foundUserTaskFromDB) {
        userTasks = userTaskFromDB;
        console.log(`${userTasks[i].title}`);
        await updateUserTaskWithCV();
    } else {
        userTasks = [];
        await updateUserTaskWithCV();
    }
};

const updateUserTaskWithCV = async () => {
    await getUserTaskFromCV();
    var latestCreateDate = 0;
    for (var i = 0; i < userTasks.length; i++) {
        if (userTasks[i].created > latestCreateDate) {
            latestCreateDate = userTasks[i].created;
        }
    }

    for (var i = 0; i < userTaskFromCV.length; i++) {
        if (userTaskFromCV[i].created > latestCreateDate) {
            var tmp = userTaskFromCV[i];
            tmp.importance = 0;
            userTasks.push(tmp);
        }
    }
};

// const getUserProfile = async () => {
//   const options = {
//     method: "GET",
//     credentials: "include",
//   };
//   await fetch(
//     `http://${backendIPAddress}/courseville/get_profile_info`,
//     options
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       user = data.user;
//       console.log(data.user);
//     })
//     .catch((error) => console.error(error));
// };

// getUserTask();