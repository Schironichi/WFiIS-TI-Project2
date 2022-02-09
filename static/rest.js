let main_url = "";
let db;

function init() {
    let openRequest = indexedDB.open("store", 1);

    openRequest.onupgradeneeded = function() {
        db = openRequest.result;
        var objs = db.createObjectStore('ankieta', {keyPath: 'id', autoIncrement: true});
        objs.createIndex("rok", "rok");
        objs.createIndex("skala", "skala");
        objs.createIndex("p1c", "p1c");
        objs.createIndex("p2c", "p2c");
        objs.createIndex("p3c", "p3c");
        objs.createIndex("p4c", "p4c");
        objs.createIndex("p5c", "p5c");
        objs.createIndex("p6c", "p6c");
        objs.createIndex("kolor", "kolor");
    };

    openRequest.onerror = function() {
        alert("Error: " + openRequest.error);
    };

    openRequest.onsuccess = function() {
        db = openRequest.result;
    };
}

function authValidation(form, type) {
    var text = "";
    if (form.login.value == '') {
        text += "Nie podano loginu.\n";
    }
    if (form.pass.value == '') {
        text += "Nie podano hasła.\n";
    } else if (type == 'register' && form.pass.value.length < 5) {
        text += "Hasło za krótkie. Podaj przynajmniej 5 znaków.\n";
    }
    if (text != "") {
        alert(text);
        return false;
    } else {
        return true;
    }
}

function authPoll(form) {
    var text = "";
    if (form.rok.value == '') {
        text += "Nie wybrano roku studiów.\n";
    }
    if (!(form.p1c.checked || form.p2c.checked || form.p3c.checked || form.p4c.checked || form.p5c.checked || form.p6c.checked)) {
        text += "Wybierzy przynajmniej jeden przymiotnik.\n";
    }
    if (text != "") {
        alert(text);
        return false;
    } else {
        return true;
    }
}

function send(form) {
    document.getElementById('plots').innerHTML = '';
    var res = {};
    res.rok = form.rok.value;
    res.skala = form.skala.value;
    res.p1c = form.p1c.checked;
    res.p2c = form.p2c.checked;
    res.p3c = form.p3c.checked;
    res.p4c = form.p4c.checked;
    res.p5c = form.p5c.checked;
    res.p6c = form.p6c.checked;
    res.kolor = form.kolor.value;
    var data = JSON.stringify(res);
    if(navigator.onLine && getCookie() != '') {
        var url = main_url + "send";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "post",
            headers: headers,
            body: data
        })
        .then(response => {
            response.json().then(data => {
                if (data.status == "ok") {
                    document.getElementById('data').innerHTML = '<div class="formularz">' +
                    '   <article class="wpis">' +
                    '       <h2>Pomyślnie wysłano dane do bazy serwerowej MongoDB!</h2>' +
                    '   </article>' +
                    '</div>';
                    document.getElementById('result').innerHTML = '';
                } else {
                    alert(data.msg);
                }
            });
        })
        .catch(error => console.log("Błąd: ", error)); 
    } else {
        var tx = db.transaction('ankieta', 'readwrite');
        if (tx.objectStore('ankieta').put(res)) {
            document.getElementById('data').innerHTML = '<div class="formularz">' +
            '   <article class="wpis">' +
            '       <h2>Pomyślnie wysłano dane do bazy przeglądarkowej IndexedDB!</h2>' +
            '   </article>' +
            '</div>';
            document.getElementById('result').innerHTML = '';
        } else {
            alert('Nie udało się dodać odpowiedzi!');
        }
    }
}

function showValue(value) {
    document.getElementById('val').innerHTML = value;
}

function _addPoll() {
    document.getElementById('data').innerHTML = "<form class='ankieta' action='#'>" +
    "   <p>Pytanie 1: Na którym roku jesteś?<p>" +
    "   <input type='radio' id='1' name='rok' value='1'>" +
    "   <label for='1'>Pierwszym</label><br>" +
    "   <input type='radio' id='2' name='rok' value='2'>" +
    "   <label for='2'>Drugim</label><br>" +
    "   <input type='radio' id='3' name='rok' value='3'>" +
    "   <label for='3'>Trzecim</label><br>" +
    "   <input type='radio' id='4' name='rok' value='4'>" +
    "   <label for='4'>Czwartym</label><br>" +
    "   <input type='radio' id='5' name='rok' value='5'>" +
    "   <label for='5'>Piątym</label><br><br>" +
    "   <p>Pytanie 2: W skali od 0 do 10, jak bardzo zadowolony jesteś ze studiów?</p>" +
    "   <input type='range' id='skala' name='skala' min='0' max='10' value='5' onchange='showValue(this.value)'><span id='val'>5</span><br><br>" +
    "   <p>Pytanie 3: Które cechy opisują uczelnię?</p>" +
    "   <input type='checkbox' id='p1c' name='p1c' value='Nowoczesna'>" +
    "   <label for='p1c'>Nowoczesna</label><br>" +
    "   <input type='checkbox' id='p2c' name='p2c' value='Innowacyjna'>" +
    "   <label for='p2c'>Innowacyjna</label><br>" +
    "   <input type='checkbox' id='p3c' name='p3c' value='Najlepsza'>" +
    "   <label for='p3c'>Najlepsza</label><br>" +
    "   <input type='checkbox' id='p4c' name='p4c' value='Motywująca'>" +
    "   <label for='p4c'>Motywująca</label><br>" +
    "   <input type='checkbox' id='p5c' name='p5c' value='Dołująca'>" +
    "   <label for='p5c'>Dołująca</label><br>" +
    "   <input type='checkbox' id='p6c' name='p6c' value='Z tradycjami'>" +
    "   <label for='p6c'>Z tradycjami</label><br><br>" +
    "   <p>Pytanie 4: Jaki jest Twój ulubiony kolor?</p>" +
    "   <input type='color' id='kolor' name='kolor'><br><br>" +
    "   <input type='button' value='Wyślij odpowiedzi' onclick='if (authPoll(this.form)) send(this.form)'>" +
    "</form>";
    document.getElementById('plots').innerHTML = '';
    document.getElementById('result').innerHTML = '';
}

function _toggleView() {
    var wyniki = document.getElementById('wyniki');
    if (wyniki.style.display == 'none') {
        wyniki.style.display = 'inherit';
    } else {
        wyniki.style.display = 'none';
    }
}

function fillCanvas(id, data, mode) {
    var lastend = 0;
    var amount = data.length;
    var min;
    var max;
    var colors = ['blue', 'red', 'yellow', 'green', 'orange', 'black', 'gray', 'white', 'magenta', 'cyan', 'lime'];
    var canvas = document.getElementById(id);
    var ctx = canvas.getContext("2d");
    var counts = {};
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    switch (mode) {
        case 1:
            min = 1
            max = 6;
            break;
        case 2:
            min = 0
            max = 11;
            break;
        case 3:
            var new_data = {};
            new_data[0] = data.map(obj => obj.p1c);
            new_data[1] = data.map(obj => obj.p2c);
            new_data[2] = data.map(obj => obj.p3c);
            new_data[3] = data.map(obj => obj.p4c);
            new_data[4] = data.map(obj => obj.p5c);
            new_data[5] = data.map(obj => obj.p6c);
            min = 0;
            max = 6;
            amount = new_data[0].length;
            for (var i = min; i < max; i++) {
                counts[i] = 0;
            }
            var count = 0;
            for (var i = min; i < max; i++) {
                for (var j = min; j < amount; j++)
                if(new_data[i][j]) {
                    count++;
                    counts[i] += 1;
                }
            }
            amount = count;
            var texts = ['Nowoczesna', 'Innowacyjna', 'Najlepsza', 'Motywująca', 'Dołująca', 'Z tradycjami'];
            break;
        case 4:
            colors = [];
            min = 0;
            max = data.length;
            for (const num of data) {
                colors.push(num);
            }
            break;
        default:
            alert('Nie ma takiego trybu');
            return;
    }
    if (mode != 3 && mode != 4) {
        for (var i = min; i < max; i++) {
            counts[i] = 0;
        }
    
        for (const num of data) {
            counts[num] += 1;
        }
    }

    ctx.font = 'bold 12px sans-serif';
    ctx.strokeStyle = '#4e4e50';
    var sel = 0;
    var temp;
    for (var i = min; i < max; i++) {
        ctx.fillStyle = colors[sel++];
        switch (mode) {
            case 1:
            case 2:
                ctx.fillRect(225, i * 200 / max, 10, 10);
                ctx.fillText(i, 245, i * 200 / max + 10);
                temp = counts[i];
                break;
            case 3:
                ctx.fillRect(225, i * 200 / max + 10, 10, 10);
                ctx.fillText(texts[i], 245, i * 200 / max + 20);
                temp = counts[i];
                break;
            case 4:
                temp = 1;
                break;
            default:
                break;
        }
        ctx.beginPath();
        ctx.moveTo(100, 100);
        ctx.arc(100, 100, 100, lastend, lastend + (Math.PI * 2 * (temp / amount)), false);
        ctx.fill();
        ctx.stroke();
        lastend += Math.PI * 2 * (temp / amount);
    }
}

function drawResults(data) {
    document.getElementById('plots').innerHTML = '<div class="formularz"><span>Pytanie 1: Na którym roku jesteś?</span><br>' +
        '<canvas id="q1" width="275" height="200"></canvas><br><br>' +
        '<span>Pytanie 2: W skali od 0 do 10, jak bardzo zadowolony jesteś ze studiów?</span><br>' +
        '<canvas id="q2" width="275" height="200"></canvas><br><br>' +
        '<span>Pytanie 3: Które cechy opisują uczelnię?</span><br>' +
        '<canvas id="q3" width="350" height="200"></canvas><br><br>' +
        '<span>Pytanie 4: Jaki jest Twój ulubiony kolor?</span><br>' +
        '<canvas id="q4" width="200" height="200"></canvas><br></div><br>';
        fillCanvas('q1', data.map(obj => obj.rok), 1);
        fillCanvas('q2', data.map(obj => obj.skala), 2);
        fillCanvas('q3', data, 3);
        fillCanvas('q4', data.map(obj => obj.kolor), 4);
}

function _showPoll() {
    document.getElementById('data').innerHTML = '';
    document.getElementById('plots').innerHTML = '';
    var wynik = '<div class="formularz">';
    if(navigator.onLine && getCookie() != '') {
        wynik += '<article class="wpis"><h2>Wyniki - MongoDB</h2></article>';
        wynik += '<table class="wyniki" id="wyniki" style="display: none;"><tr>' +
            '<th>#1</th>' +
            '<th>#2</th>' +
            '<th>#3: Nowoczesna</th>' +
            '<th>#3: Innowacyjna</th>' +
            '<th>#3: Najlepsza</th>' +
            '<th>#3: Motywująca</th>' +
            '<th>#3: Dołująca</th>' +
            '<th>#3: Z tradycjami</th>' +
            '<th>#4</th></tr>';
        var url = main_url + "list";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "get",
            headers: headers
        })
        .then(response => {
            response.json().then(elem => {
                elem.forEach(data => {
                    wynik += '<tr>' +
                    '<td>' + data["rok"] +'</td>' +
                    '<td>' + data["skala"] + '</td>' +
                    '<td>' + data["p1c"] + '</td>' +
                    '<td>' + data["p2c"] + '</td>' +
                    '<td>' + data["p3c"] + '</td>' +
                    '<td>' + data["p4c"] + '</td>' +
                    '<td>' + data["p5c"] + '</td>' +
                    '<td>' + data["p6c"] + '</td>' +
                    '<td>' + data["kolor"] + '</td></tr>';
                });
                wynik += '</table><br><input type="button" value="Pokaż wyniki" onclick="_toggleView()"><br>';
                wynik += '</div><br>';
                document.getElementById('data').innerHTML = wynik;
                drawResults(elem);
            });
        })
        .catch(error => console.log("Błąd: ", error));
    }
    var idb = '<div class="formularz">' +
        '<article class="wpis"><h2>Wyniki - IndexedDB</h2></article>' + 
        '<table class="wyniki" id="wyniki"><tr>' +
        '<th>#1</th>' +
        '<th>#2</th>' +
        '<th>#3: Nowoczesna</th>' +
        '<th>#3: Innowacyjna</th>' +
        '<th>#3: Najlepsza</th>' +
        '<th>#3: Motywująca</th>' +
        '<th>#3: Dołująca</th>' +
        '<th>#3: Z tradycjami</th>' +
        '<th>#4</th></tr>';
    var tx = db.transaction('ankieta', 'readwrite');
    var os = tx.objectStore('ankieta');
    os.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            idb += '<tr>' +
            '<td>' + cursor.value.rok +'</td>' +
            '<td>' + cursor.value.skala + '</td>' +
            '<td>' + cursor.value.p1c + '</td>' +
            '<td>' + cursor.value.p2c + '</td>' +
            '<td>' + cursor.value.p3c + '</td>' +
            '<td>' + cursor.value.p4c + '</td>' +
            '<td>' + cursor.value.p5c + '</td>' +
            '<td>' + cursor.value.p6c + '</td>' +
            '<td>' + cursor.value.kolor + '</td></tr>';
            cursor.continue();
        } else {
            idb += '</table><br><br>';
            if (getCookie() != "") {
                idb += '<input type="button" value="Wyślij do MongoDB" onclick="syncDatabases()">';
            } else {
                idb += '<p>Aby wysłać wyniki do bazy MongoDB, proszę się zalogować.</p>'
            }
            idb += '</div>';
            document.getElementById('result').innerHTML = idb;
        }
    }
    os.openCursor().onerror = function (event) {
        alert('Nie udało się wyświetlić danych');
    }
}



function showMenu(state) {
    if (state == 'online') {
        document.getElementById('login').style.display = 'none';
        document.getElementById('logout').style.display = 'inherit';
        document.getElementById('data').innerHTML = '<div class="formularz">' +
                        '   <article class="wpis">' +
                        '       <h2>Pomyślnie zalogowano</h2>' +
                        '       <p style="color: white;">Dane przechowywane w IndexedDB zostały przesłane na serwer.</p>' +
                        '       <p style="color: white;">Dodanie, usunięcie oraz modyfikowanie wpisów zostanie dokonane na wpisach serwerowych.</p>' +
                        '   </article>' +
                        '</div>';
        document.getElementById('plots').innerHTML = '';
        document.getElementById('result').innerHTML = '';
    } else if (state = 'offline') {
        document.getElementById('login').style.display = 'inherit';
        document.getElementById('logout').style.display = 'none';
        document.getElementById('data').innerHTML = '<div class="formularz">' +
                        '   <article class="wpis">' +
                        '       <h2>Użytkownik niezalogowany</h2>' +
                        '       <p style="color: white;">Dodanie, usunięcie oraz modyfikowanie wpisów zostanie dokonane w przeglądarce (IndexedDB).</p>' +
                        '       <p style="color: white;">Po zalogowaniu, wartości zapisane lokalnie zostaną przekazane na serwer.</p>' +
                        '   </article>' +
                        '</div>';
        document.getElementById('plots').innerHTML = '';
        document.getElementById('result').innerHTML = '';
    } else {
        alert('Nie istnieje taki status!');
    }
}

function syncDatabases() {
    var tx = db.transaction('ankieta', 'readwrite');
    var os = tx.objectStore('ankieta');
    os.openCursor().onsuccess = function (event) {
        var cursor = event.target.result;
        if (cursor) {
            var res = {};
            res.rok = cursor.value.rok;
            res.skala = cursor.value.skala;
            res.p1c = cursor.value.p1c;
            res.p2c = cursor.value.p2c;
            res.p3c = cursor.value.p3c;
            res.p4c = cursor.value.p4c;
            res.p5c = cursor.value.p5c;
            res.p6c = cursor.value.p6c;
            res.kolor = cursor.value.kolor;
            var data = JSON.stringify(res);
            var url = main_url + "send";
            const headers = new Headers();
            headers.append("Content-type", "application/x-www-form-urlencoded");
            fetch(url, {
                method: "post",
                headers: headers,
                body: data
            })
            .then(response => {
                response.json().then(data => {
                    if (data.status == "ok") {
                        _showPoll();
                    } else {
                        alert(data.msg);
                    }
                });
            })
            .catch(error => console.log("Błąd: ", error));
            cursor.delete();
            cursor.continue();
        }
    }
}

function _login(form) {
    if (authValidation(form, 'login')) {
        var user = {};
        user.login = form.login.value;
        user.pass = form.pass.value;
        var data = JSON.stringify(user);
        var url = main_url + "login";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "post",
            headers: headers,
            body: data
        })
        .then(response => {
            response.json().then(data => {
                if (data.status == "ok") {
                    showMenu('online');
                    syncDatabases();
                    setCookie(data.my_id);
                } else {
                    alert(data.msg);
                }
            });
            
        })
        .catch(error => console.log("Błąd: ", error)); 
    }
}

function _register(form) {
    if (authValidation(form, 'register')) {
        var user = {};
        user.login = form.login.value;
        user.pass = form.pass.value;
        var data = JSON.stringify(user);  
        var url = main_url + "register";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "post",
            headers: headers,
            body: data
        })
        .then(response => {
            response.json().then(data => {
                if (data.status == "ok") {
                    alert('Pomyślna rejestracja. Proszę się zalogować.');
                } else {
                    alert(data.msg);
                }
            });
        })
        .catch(error => console.log("Błąd: ", error)); 
    }
}

function _loginForm() {
    var element = document.getElementById('data');
    document.getElementById('plots').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    var this_form = "<form class='formularz'>" +
    "   <p>Login: <p>" +
    "   <input type='text' name='login'><br>" +
    "   <div class='break'></div>" +
    "   <p>Hasło: <p>" +
    "   <input type='password' name='pass'<br>" +
    "   <div class='break'></div>" +
    "   <input type='button' value='Zaloguj' onclick='_login(this.form)'>" +
    "   <input type='button' value='Zarejestruj' onclick='_register(this.form)'>" +
    "</form>";
    element.innerHTML = this_form;
}

function _logout() {
    document.getElementById('data').innerHTML = '';
    document.getElementById('plots').innerHTML = '';
    document.getElementById('result').innerHTML = '';
    let arr = {};
    arr.my_id = getCookie();
    var data = JSON.stringify(arr);
    var url = main_url + "logout";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "post",
            headers: headers,
            body: data
        })
        .then(response => {
            response.json().then(data => {
                if (data.status == "ok") {
                    showMenu('offline');
                    setCookie('');
                } else {
                    alert(data.msg);
                }
            });
            
        })
        .catch(error => console.log("Błąd: ", error));
}

function createCookie() {
    let arr = {};
    arr.my_id = getCookie();
    if (arr.my_id != '') {
        var data = JSON.stringify(arr);
        var url = main_url + "cookie";
        const headers = new Headers();
        headers.append("Content-type", "application/x-www-form-urlencoded");
        fetch(url, {
            method: "post",
            headers: headers,
            body: data
        })
        .then(response => {
            response.json().then(data => {
                if (data.status == "ok") {
                    showMenu('online');
                } else {
                    showMenu('offline');
                }
            });
            
        })
        .catch(error => console.log("Błąd: ", error));
    } else {
        showMenu('offline');
    }
}

function setCookie(my_id) {
    document.cookie = 'my_id=' + my_id + '; path=/';
}

function getCookie() {
    let cookies = document.cookie.split('; ');
    for (var i = 0; i < cookies.length; i++) {
        if (cookies[i].indexOf('my_id=') == 0) {
            return cookies[i].substring('my_id='.length, cookies[i].length);
        }
    }
    return '';
}

window.addEventListener("DOMContentLoaded", ()=> {
    init();
    createCookie();
});

window.addEventListener('unhandledrejection', event => {
    alert("Error: " + event.reason.message);
});
