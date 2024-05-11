const CLIENT_ID = '259180020353-q8v8vvoklaab807ch6ohecvier6ublf5.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/classroom.courses.readonly';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        clientId: CLIENT_ID,
        scope: SCOPES,
        discoveryDocs: ['https://classroom.googleapis.com/$discovery/rest?version=v1']
    }).then(function () {
        // Listen for sign-in state changes.
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        // Handle the initial sign-in state.
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    }).catch(function(error) {
        console.error('Error initializing client: ', error);
    });
}

function updateSigninStatus(isSignedIn) {
    const authorizeArea = document.getElementById('authorize_area');
    const contentArea = document.getElementById('content');

    if (isSignedIn) {
        authorizeArea.style.display = 'none';
        contentArea.style.display = 'block';
        listCourses();
    } else {
        authorizeArea.style.display = 'block';
        contentArea.style.display = 'none';
    }
}

function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

function listCourses() {
    gapi.client.classroom.courses.list({
        pageSize: 10
    }).then(function(response) {
        const courses = response.result.courses;
        appendCourses(courses);
    }).catch(function(error) {
        console.error('Error listing courses: ', error);
    });
}

function appendCourses(courses) {
    const coursesList = document.getElementById('classes_list');
    courses.forEach(function(course) {
        const li = document.createElement('li');
        li.appendChild(document.createTextNode(course.name));
        coursesList.appendChild(li);
    });
}
